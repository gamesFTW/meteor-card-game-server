let GroupName = {
    DECK: 'deck',
    HAND: 'hand',
    TABLE: 'table',
    MANA_POOL: 'manaPool',
    GRAVEYARD: 'graveyard'
};


function dieCard(card, gameId) {
    card.cardGroup = GroupName.GRAVEYARD;
    card.attachedCards = [];
    MeteorApp.CardsInGame.update(card._id, card);

    Meteor.call('deattachCard', card._id);

    MeteorApp.Actions.insert({
        gameId: gameId,
        type: 'Backend:cardDied',
        datetime: new Date(),
        params: {
            id: card._id,
            ownerId: card.ownerId
        }
    });
}


Meteor.methods({
    moveCard: function (gameId, id, position) {
        let card = MeteorApp.CardsInGame.findOne({_id: id});
        card.x = position.x;
        card.y = position.y;

        MeteorApp.CardsInGame.update(id, card);

        MeteorApp.Actions.insert({
            gameId: gameId,
            type: 'Backend:cardMoved',
            datetime: new Date(),
            params: {
                id: id,
                position: position
            }
        });
    },


    removeCard: function (gameId, id) {
        MeteorApp.CardsInGame.remove(id);

        MeteorApp.Actions.insert({
            gameId: gameId,
            type: 'Backend:cardRemoved',
            datetime: new Date(),
            params: {
                id: id
            }
        });
    },


    tapCard: function (gameId, id) {
        let card = MeteorApp.CardsInGame.findOne(id);
        card.tapped = true;

        MeteorApp.CardsInGame.update(id, card);

        MeteorApp.Actions.insert({
            gameId: gameId,
            type: 'Backend:cardTapped',
            datetime: new Date(),
            params: {
                id: id
            }
        });
    },


    untapCard: function (gameId, id) {
        let card = MeteorApp.CardsInGame.findOne({_id: id});
        card.tapped = false;

        MeteorApp.CardsInGame.update(id, card);

        MeteorApp.Actions.insert({
            gameId: gameId,
            type: 'Backend:cardUntapped',
            datetime: new Date(),
            params: {
                id: id
            }
        });
    },


    playAsMana: function (gameId, id) {
        let card = MeteorApp.CardsInGame.findOne({_id: id});
        if (card.cardGroup == GroupName.HAND) {
            card.cardGroup = GroupName.MANA_POOL;
            card.tapped = true;
            MeteorApp.CardsInGame.update(id, card);

            MeteorApp.Actions.insert({
                gameId: gameId,
                type: 'Backend:cardPlayedAsMana',
                datetime: new Date(),
                params: {
                    id: id,
                    ownerId: card.ownerId
                }
            });

            MeteorApp.Actions.insert({
                gameId: gameId,
                type: 'Backend:cardTapped',
                datetime: new Date(),
                params: {
                    id: id
                }
            });
        }
    },


    drawCard: function (gameId, id) {
        let card = MeteorApp.CardsInGame.findOne({_id: id});
        if (card.cardGroup == GroupName.DECK) {
            card.cardGroup = GroupName.HAND;
            MeteorApp.CardsInGame.update(id, card);

            // todo: добавить анимацию на потягивание карты из деки
            MeteorApp.Actions.insert({
                gameId: gameId,
                type: 'Backend:cardDrawn',
                datetime: new Date(),
                params: {
                    id: id,
                    ownerId: card.ownerId
                }
            });
        }
    },


    playerDrawRandomCards: function (gameId, playerId, cardNumber) {
        let deckCards = MeteorApp.CardsInGame.find(
            {gameId: gameId, ownerId: playerId, cardGroup: GroupName.DECK}
        ).fetch();

        let randomCardsToDraw = lodash.sample(deckCards, cardNumber);

        randomCardsToDraw.forEach(card => Meteor.call('drawCard', gameId, card._id));
    },


    discardCard: function (gameId, id) {
        let card = MeteorApp.CardsInGame.findOne({_id: id});

        if (card.cardGroup != GroupName.TABLE) {
            card.cardGroup = GroupName.GRAVEYARD;
            MeteorApp.CardsInGame.update(id, card);

            MeteorApp.Actions.insert({
                gameId: gameId,
                type: 'Backend:cardDiscarded',
                datetime: new Date(),
                params: {
                    id: id,
                    ownerId: card.ownerId
                }
            });
        }
    },


    takeCardFromGraveyard: function (gameId, id) {
        let card = MeteorApp.CardsInGame.findOne({_id: id});
        if (card.cardGroup == GroupName.GRAVEYARD) {
            card.cardGroup = GroupName.HAND;
            MeteorApp.CardsInGame.update(id, card);

            MeteorApp.Actions.insert({
                gameId: gameId,
                type: 'Backend:cardTookFromGraveyard',
                datetime: new Date(),
                params: {
                    id: id,
                    ownerId: card.ownerId
                }
            });
        }
    },


    rotateCard: function (gameId, id) {
        let card = MeteorApp.CardsInGame.findOne({_id: id});
        card.rotated = !card.rotated;

        MeteorApp.CardsInGame.update(id, card);

        MeteorApp.Actions.insert({
            gameId: gameId,
            type: 'Backend:cardRotated',
            datetime: new Date(),
            params: {
                id: id,
                rotated: card.rotated
            }
        });
    },


    playCard: function (gameId, id, position) {
        let card = MeteorApp.CardsInGame.findOne(id);

        let untappedCardsInManaPool = MeteorApp.CardsInGame.find({
            gameId: card.gameId,
            ownerId: card.ownerId,
            cardGroup: GroupName.MANA_POOL,
            tapped: false
        }).fetch();

        let cardsNumberInManaPool = MeteorApp.CardsInGame.find({
            gameId: card.gameId,
            ownerId: card.ownerId,
            cardGroup: GroupName.MANA_POOL
        }).count();

        let isCastable = !(card.attachable && card.cardGroup == GroupName.HAND);
        let isHaveMana = untappedCardsInManaPool.length >= card.mana;
        let isGameNotStarted = cardsNumberInManaPool == 0;

        if (_.contains(['creature', 'area'], card.type) &&
            isCastable &&
            (isHaveMana || isGameNotStarted)
            ) {
            let playType = card.type == 'creature' ? 'summon' : 'cast';

            card.cardGroup = GroupName.TABLE;
            card.x = position.x;
            card.y = position.y;

            MeteorApp.CardsInGame.update(id, card);

            MeteorApp.Actions.insert({
                gameId: gameId,
                type: 'Backend:cardPlayed',
                datetime: new Date(),
                params: {
                    id: id,
                    position: position,
                    ownerId: card.ownerId,
                    playType: playType
                }
            });

            if (playType == 'cast') {
                Meteor.call('deattachCard', id);
            }

            Meteor.call('tapCard', gameId, id);

            // Tap mana
            untappedCardsInManaPool.slice(0, card.mana).forEach(
                card => Meteor.call('tapCard', gameId, card._id)
            );
        }

        let isUntapped = !card.tapped;
        if (_.contains(['spell'], card.type) && isHaveMana && isUntapped) {
            dieCard(card, gameId);

            // Tap mana
            untappedCardsInManaPool.slice(0, card.mana).forEach(
                card => Meteor.call('tapCard', gameId, card._id)
            );
        }
    },


    playCardAsAttach: function (gameId, playedCardId, targetCardId) {
        let playedCard = MeteorApp.CardsInGame.findOne({_id: playedCardId});
        let targetCard = MeteorApp.CardsInGame.findOne({_id: targetCardId});

        let fromTable = targetCard.cardGroup == GroupName.TABLE;
        let isTargetCardTypeCreature = targetCard.type == 'creature';

        if (fromTable && playedCard.attachable && isTargetCardTypeCreature) {
            playedCard.cardGroup = GroupName.TABLE;
            targetCard.attachedCards.push(playedCardId);

            MeteorApp.CardsInGame.update(playedCardId, playedCard);
            MeteorApp.CardsInGame.update(targetCardId, targetCard);

            MeteorApp.Actions.insert({
                gameId: gameId,
                type: 'Backend:cardPlayedAsAttach',
                datetime: new Date(),
                params: {
                    playedCardId: playedCardId,
                    targetCardId: targetCardId,
                    ownerId: targetCard.ownerId
                }
            });

            Meteor.call('tapCard', gameId, playedCardId);
        }
    },
    
    
    putSpellOnTable: function (gameId, id) {
        let card = MeteorApp.CardsInGame.findOne(id);

        if (_.contains(['spell'], card.type)) {
            card.cardGroup = GroupName.TABLE;
            MeteorApp.CardsInGame.update(id, card);

            MeteorApp.Actions.insert({
                gameId: gameId,
                type: 'Backend:cardPlayedAsSpell',
                datetime: new Date(),
                params: {
                    id: id,
                    ownerId: card.ownerId
                }
            });

            Meteor.call('tapCard', gameId, id);
        }
    },


    moveCardToPreviousGroup: function (gameId, id) {
        let card = MeteorApp.CardsInGame.findOne({_id: id});
        let group = card.cardGroup;

        if (group === GroupName.TABLE) {
            card.cardGroup = GroupName.HAND;
            card.attachedCards.forEach(
                cardId => Meteor.call('moveCardToPreviousGroup', gameId, cardId)
            );
            card.attachedCards = [];

            Meteor.call('deattachCard', id);
        } else if (group === GroupName.HAND) {
            card.cardGroup = GroupName.DECK;
        } else if (group === GroupName.GRAVEYARD) {
            if (card.type == 'creature') {
                card.cardGroup = GroupName.TABLE;
            } else if (card.attachable) {
                card.cardGroup = GroupName.HAND;
            }
        } else if (group === GroupName.MANA_POOL) {
            card.cardGroup = GroupName.HAND;
        }

        MeteorApp.CardsInGame.update(id, card);

        MeteorApp.Actions.insert({
            gameId: gameId,
            type: 'Backend:cardMovedToPreviousGroup',
            datetime: new Date(),
            params: {
                id: id,
                oldCardGroup: group,
                newCardGroup: card.cardGroup,
                ownerId: card.ownerId
            }
        });
    },


    deattachCard: function (id) {
        let card = MeteorApp.CardsInGame.findOne({_id: id});

        if (card.attachable) {
            let parentCards = MeteorApp.CardsInGame.find(
                {attachedCards: card._id}
            );

            parentCards.forEach(function (parentCard) {
                parentCard.attachedCards = lodash.without(
                    parentCard.attachedCards, card._id
                );
                MeteorApp.CardsInGame.update(parentCard._id, parentCard);
            });
        }
    },


    addHealth: function (gameId, id, health) {
        let card = MeteorApp.CardsInGame.findOne({_id: id});
        card.health = card.health + health;

        MeteorApp.CardsInGame.update(id, card);

        MeteorApp.Actions.insert({
            gameId: gameId,
            type: 'Backend:cardHealthChanged',
            datetime: new Date(),
            params: {
                id: id,
                health: card.health
            }
        });

        if (card.health <= 0 && card.cardGroup == GroupName.TABLE) {
            card.attachedCards.forEach(function (cardId) {
                let attachedCard = MeteorApp.CardsInGame.findOne({_id: cardId});
                dieCard(attachedCard, gameId);
            });
            dieCard(card, gameId);
        }
    },


    addCounter: function (gameId, id, counter) {
        let card = MeteorApp.CardsInGame.findOne({_id: id});
        card.counter = card.counter + counter;
        if (card.counter < 0 || card.counter > 6) {
            return;
        }

        MeteorApp.CardsInGame.update(id, card);

        MeteorApp.Actions.insert({
            gameId: gameId,
            type: 'Backend:cardCounterChanged',
            datetime: new Date(),
            params: {
                id: id,
                counter: card.counter
            }
        });
    },


    untapCardsInManaPool: function (gameId, playerId, numberOfCardsToUntup) {
        let manaCards = MeteorApp.CardsInGame.find({
            gameId: gameId, 
            ownerId: playerId,
            cardGroup: GroupName.MANA_POOL,
            tapped: true
        }, {
            limit: numberOfCardsToUntup, 
            fields: {_id: true }
        }).fetch();

        manaCards.forEach((card) => {
            Meteor.call('untapCard', gameId, card._id);
        });
    },
    
    
    untapCardsInTable: function (gameId, playerId) {
        let manaCards = MeteorApp.CardsInGame.find({
            gameId: gameId,
            ownerId: playerId,
            cardGroup: GroupName.TABLE,
            tapped: true
        }, {
            fields: {_id: true }
        }).fetch();

        manaCards.forEach((card) => {
            Meteor.call('untapCard', gameId, card._id);
        });
    }
});
