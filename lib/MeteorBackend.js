MeteorApp = {};

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
    }
});