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
    'witch'
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
        card.isTapped = true;

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
        card.isTapped = false;

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


    playCard: function(id, position) {
        var card = MeteorApp.Card.findOne({_id: id});
        card.cardGroup = GroupName.TABLE;
        card.x = position.x;
        card.y = position.y;

        MeteorApp.Card.update(id, card);

        MeteorApp.Action.insert({
            type: 'Backend:cardPlayed',
            params: {
                id: id,
                position: position,
                ownerId: card.ownerId
            }
        });
    },


    moveCardToPreviousGroup: function(id) {
        var card = MeteorApp.Card.findOne({_id: id});
        var group = card.cardGroup;

        if (group === GroupName.TABLE) {
            card.cardGroup = GroupName.HAND;
        } else if(group === GroupName.HAND) {
            card.cardGroup = GroupName.DECK;
        } else if(group === GroupName.GRAVEYARD) {
            card.cardGroup = GroupName.TABLE;
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

        if (card.health <= 0 && card.cardGroup == GroupName.TABLE) {
            card.cardGroup = GroupName.GRAVEYARD;
            MeteorApp.Card.update(id, card);


            MeteorApp.Action.insert({
                type: 'Backend:cardDied',
                params: {
                    id: id,
                    ownerId: card.ownerId
                }
            });
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
