MeteorApp = {};

MeteorApp.Card = new Mongo.Collection("Card");
MeteorApp.Action = new Mongo.Collection("Action");


Meteor.methods({
    moveCreature: function(id, position) {
        var card = MeteorApp.Card.findOne({_id: id});
        card.x = position.x;
        card.y = position.y;

        MeteorApp.Card.update(id, card);

        MeteorApp.Action.insert({
            type: 'Backend:creatureMoved',
            params: {
                id: id,
                position: position
            }
        });
    },


    removeCreature: function(id) {
        MeteorApp.Card.remove(id);

        MeteorApp.Action.insert({
            type: 'Backend:creatureRemoved',
            params: {
                id: id
            }
        });
    }
});
