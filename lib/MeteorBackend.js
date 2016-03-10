MeteorApp = {};

MeteorApp.data = {
    playerId: null
};

MeteorApp.Card = new Mongo.Collection("Card");
MeteorApp.Action = new Mongo.Collection("Action");

MeteorApp.imageFileNames = [
    'adopt',
    'archer',
    'archerfemale',
    'blind',
    'blindfemale',
    'bodyguard',
    'burglar',
    'burglarfemale',
    'citizen',
    'citizenfemale',
    'farmer',
    'hunter',
    'hunterfemale',
    'master_archer',
    'master_archerfemale',
    'master_oracle',
    'medium',
    'mediumfemale',
    'ninja',
    'ninjafemale',
    'oracle',
    'oraclemale',
    'pickpocket',
    'pickpocketfemale',
    'rebel',
    'rogue',
    'roguefemale',
    'runaway',
    'shadow_walker',
    'shadow_walkerfemale',
    'thief',
    'thieffemale',
    'warden',
    'warrior',
    'witch',
    'u_master_archer',
    'u_kentavr',
    'u_gor',
    'u_mage',
    'u_mino'
];


var GroupName = {
    DECK: 'deck',
    HAND: 'hand',
    TABLE: 'table',
    MANA_POOL: 'manaPool',
    GRAVEYARD: 'graveyard'
};


Meteor.methods({
    moveCard: function(id, position) {
        var card = MeteorApp.Card.findOne({_id: id});
        card.x = position.x;
        card.y = position.y;

        MeteorApp.Card.update(id, card);

        MeteorApp.Action.insert({
            type: 'Backend:cardMoved',
            params: {
                id: id,
                position: position
            }
        });
    },


    removeCard: function(id) {
        MeteorApp.Card.remove(id);

        MeteorApp.Action.insert({
            type: 'Backend:cardRemoved',
            params: {
                id: id
            }
        });
    },


    tapCard: function(id) {
        var card = MeteorApp.Card.findOne({_id: id});
        card.tapped = true;

        MeteorApp.Card.update(id, card);

        MeteorApp.Action.insert({
            type: 'Backend:cardTapped',
            params: {
                id: id
            }
        });
    },


    untapCard: function(id) {
        var card = MeteorApp.Card.findOne({_id: id});
        card.tapped = false;

        MeteorApp.Card.update(id, card);

        MeteorApp.Action.insert({
            type: 'Backend:cardUntapped',
            params: {
                id: id
            }
        });
    },


    playAsMana: function(id) {
        var card = MeteorApp.Card.findOne({_id: id});
        if (card.cardGroup == GroupName.HAND) {
            card.cardGroup = GroupName.MANA_POOL;
            card.tapped = true;
            MeteorApp.Card.update(id, card);

            MeteorApp.Action.insert({
                type: 'Backend:cardPlayedAsMana',
                params: {
                    id: id,
                    ownerId: card.ownerId
                }
            });

            MeteorApp.Action.insert({
                type: 'Backend:cardTapped',
                params: {
                    id: id
                }
            });
        }
    },


    drawCard: function(id) {
        var card = MeteorApp.Card.findOne({_id: id});
        if (card.cardGroup == GroupName.DECK) {
            card.cardGroup = GroupName.HAND;
            MeteorApp.Card.update(id, card);

            MeteorApp.Action.insert({
                type: 'Backend:cardDrawn',
                params: {
                    id: id,
                    ownerId: card.ownerId
                }
            });
        }
    },


    rotateCard: function(id) {
        var card = MeteorApp.Card.findOne({_id: id});
        card.rotated = !card.rotated;

        MeteorApp.Card.update(id, card);

        MeteorApp.Action.insert({
            type: 'Backend:cardRotated',
            params: {
                id: id,
                rotated: card.rotated
            }
        });
    },


    playCard: function(id, position) {
        var card = MeteorApp.Card.findOne({_id: id});

        var isCastable = !(card.attachable && card.cardGroup == GroupName.HAND);

        if (_.contains(['creature', 'area'], card.type) && isCastable) {
            var playType = card.type == 'creature' ? 'summon' : 'cast';

            card.cardGroup = GroupName.TABLE;
            card.x = position.x;
            card.y = position.y;

            MeteorApp.Card.update(id, card);

            MeteorApp.Action.insert({
                type: 'Backend:cardPlayed',
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
        }
    },


    playCardAsSpell: function(playedCardId, targetCardId) {
        var playedCard = MeteorApp.Card.findOne({_id: playedCardId});
        var targetCard = MeteorApp.Card.findOne({_id: targetCardId});

        var fromTable = targetCard.cardGroup == GroupName.TABLE;
        var isTargetCardTypeCreature = targetCard.type == 'creature';

        if (fromTable && playedCard.attachable && isTargetCardTypeCreature) {
            playedCard.cardGroup = GroupName.TABLE;
            targetCard.attachedCards.push(playedCardId);

            MeteorApp.Card.update(playedCardId, playedCard);
            MeteorApp.Card.update(targetCardId, targetCard);

            MeteorApp.Action.insert({
                type: 'Backend:cardPlayedAsSpell',
                params: {
                    playedCardId: playedCardId,
                    targetCardId: targetCardId,
                    ownerId: targetCard.ownerId
                }
            });

            Meteor.call('tapCard', playedCardId);
        }
    },


    moveCardToPreviousGroup: function(id) {
        var card = MeteorApp.Card.findOne({_id: id});
        var group = card.cardGroup;

        if (group === GroupName.TABLE) {
            card.cardGroup = GroupName.HAND;
            card.attachedCards.forEach(
                cardId => Meteor.call('moveCardToPreviousGroup', cardId)
            );
            card.attachedCards = [];

            Meteor.call('deattachCard', id);
        } else if(group === GroupName.HAND) {
            card.cardGroup = GroupName.DECK;
        } else if(group === GroupName.GRAVEYARD) {
            if (card.type == 'creature') {
                card.cardGroup = GroupName.TABLE;
            } else if (card.attachable) {
                card.cardGroup = GroupName.HAND;
            }
        } else if(group === GroupName.MANA_POOL) {
            card.cardGroup = GroupName.HAND;
        }

        MeteorApp.Card.update(id, card);

        MeteorApp.Action.insert({
            type: 'Backend:cardMovedToPreviousGroup',
            params: {
                id: id,
                oldCardGroup: group,
                newCardGroup: card.cardGroup,
                ownerId: card.ownerId
            }
        });
    },


    deattachCard: function(id) {
        var card = MeteorApp.Card.findOne({_id: id});

        if (card.attachable) {
            var parentCards = MeteorApp.Card.find(
                {attachedCards: card._id}
            );

            parentCards.forEach(function (parentCard) {
                parentCard.attachedCards = lodash.without(
                    parentCard.attachedCards, card._id
                );
                MeteorApp.Card.update(parentCard._id, parentCard);
            });
        }
    },


    addHealth: function(id, health) {
        var card = MeteorApp.Card.findOne({_id: id});
        card.health = card.health + health;

        MeteorApp.Card.update(id, card);

        MeteorApp.Action.insert({
            type: 'Backend:cardHealthChanged',
            params: {
                id: id,
                health: card.health
            }
        });

        function dieCard(card) {
            card.cardGroup = GroupName.GRAVEYARD;
            card.attachedCards = [];
            MeteorApp.Card.update(card._id, card);

            MeteorApp.Action.insert({
                type: 'Backend:cardDied',
                params: {
                    id: card._id,
                    ownerId: card.ownerId
                }
            });
        }

        if (card.health <= 0 && card.cardGroup == GroupName.TABLE) {
            card.attachedCards.forEach(function(cardId) {
                var attachedCard = MeteorApp.Card.findOne({_id: cardId});
                dieCard(attachedCard);
            });
            dieCard(card);
        }
    },


    addCounter: function(id, counter) {
        var card = MeteorApp.Card.findOne({_id: id});
        card.counter = card.counter + counter;
        if (card.counter < 0 || card.counter > 6) {
            return;
        }

        MeteorApp.Card.update(id, card);

        MeteorApp.Action.insert({
            type: 'Backend:cardCounterChanged',
            params: {
                id: id,
                counter: card.counter
            }
        });
    }
});
