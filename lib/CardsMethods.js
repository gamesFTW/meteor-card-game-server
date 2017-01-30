MeteorApp = {};

MeteorApp.data = {
    playerId: null
};

var GroupName = {
    DECK: 'deck',
    HAND: 'hand',
    TABLE: 'table',
    MANA_POOL: 'manaPool',
    GRAVEYARD: 'graveyard'
};


Meteor.methods({
    moveCard: function (gameId, id, position) {
        var card = MeteorApp.CardsInGame.findOne({_id: id});
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
        var card = MeteorApp.CardsInGame.findOne(id);
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
        var card = MeteorApp.CardsInGame.findOne({_id: id});
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
        var card = MeteorApp.CardsInGame.findOne({_id: id});
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
        var card = MeteorApp.CardsInGame.findOne({_id: id});
        if (card.cardGroup == GroupName.DECK) {
            card.cardGroup = GroupName.HAND;
            MeteorApp.CardsInGame.update(id, card);

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


    discardCard: function (gameId, id) {
        var card = MeteorApp.CardsInGame.findOne({_id: id});

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
        var card = MeteorApp.CardsInGame.findOne({_id: id});
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
        var card = MeteorApp.CardsInGame.findOne({_id: id});
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
        var card = MeteorApp.CardsInGame.findOne(id);

        var untappedCardsInManaPool = MeteorApp.CardsInGame.find({
            gameId: card.gameId,
            ownerId: card.ownerId,
            cardGroup: GroupName.MANA_POOL,
            tapped: false
        }).fetch();

        var cardsNumberInManaPool = MeteorApp.CardsInGame.find({
            gameId: card.gameId,
            ownerId: card.ownerId,
            cardGroup: GroupName.MANA_POOL
        }).count();

        var isCastable = !(card.attachable && card.cardGroup == GroupName.HAND);
        var isHaveMana = untappedCardsInManaPool.length >= card.mana;
        var isGameNotStarted = cardsNumberInManaPool == 0;

        if (_.contains(['creature', 'area'], card.type) && isCastable && (isHaveMana || isGameNotStarted)) {
            var playType = card.type == 'creature' ? 'summon' : 'cast';

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
    },


    playCardAsSpell: function (gameId, playedCardId, targetCardId) {
        var playedCard = MeteorApp.CardsInGame.findOne({_id: playedCardId});
        var targetCard = MeteorApp.CardsInGame.findOne({_id: targetCardId});

        var fromTable = targetCard.cardGroup == GroupName.TABLE;
        var isTargetCardTypeCreature = targetCard.type == 'creature';

        if (fromTable && playedCard.attachable && isTargetCardTypeCreature) {
            playedCard.cardGroup = GroupName.TABLE;
            targetCard.attachedCards.push(playedCardId);

            MeteorApp.CardsInGame.update(playedCardId, playedCard);
            MeteorApp.CardsInGame.update(targetCardId, targetCard);

            MeteorApp.Actions.insert({
                gameId: gameId,
                type: 'Backend:cardPlayedAsSpell',
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


    moveCardToPreviousGroup: function (gameId, id) {
        var card = MeteorApp.CardsInGame.findOne({_id: id});
        var group = card.cardGroup;

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
        var card = MeteorApp.CardsInGame.findOne({_id: id});

        if (card.attachable) {
            var parentCards = MeteorApp.CardsInGame.find(
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
        var card = MeteorApp.CardsInGame.findOne({_id: id});
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

        function dieCard(card) {
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

        if (card.health <= 0 && card.cardGroup == GroupName.TABLE) {
            card.attachedCards.forEach(function (cardId) {
                var attachedCard = MeteorApp.CardsInGame.findOne({_id: cardId});
                dieCard(attachedCard);
            });
            dieCard(card);
        }
    },


    addCounter: function (gameId, id, counter) {
        var card = MeteorApp.CardsInGame.findOne({_id: id});
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
    }
});
