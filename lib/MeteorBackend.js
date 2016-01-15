MeteorApp = {};

MeteorApp.data = {
    playerId: null
};

MeteorApp.Card = new Mongo.Collection("Card");
MeteorApp.Action = new Mongo.Collection("Action");


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
        if (card.cardGroup == 'hand') {
            card.cardGroup = 'manaPool';
            MeteorApp.Card.update(id, card);

            MeteorApp.Action.insert({
                type: 'Backend:cardPlayedAsMana',
                params: {
                    id: id,
                    ownerId: card.ownerId
                }
            });
        }
    },


    playCard: function(id, position) {
        var card = MeteorApp.Card.findOne({_id: id});
        card.cardGroup = 'table';
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

        if (card.health <= 0 && card.cardGroup == 'table') {
            card.cardGroup = 'graveyard';
            MeteorApp.Card.update(id, card);


            MeteorApp.Action.insert({
                type: 'Backend:cardDied',
                params: {
                    id: id,
                    ownerId: card.ownerId
                }
            });
        }
    }
});
