MeteorApp = {};
MeteorApp.lib = MeteorApp.lib || {};
MeteorApp.lib.field = MeteorApp.lib.field || {};
MeteorApp.lib.field.creature = MeteorApp.lib.field.creature || {};

MeteorApp.lib.field.creature.CreatureCollection = new Mongo.Collection("Creature");

MeteorApp.lib.ActionCollection = new Mongo.Collection("Action");


var Creature = MeteorApp.lib.field.creature.CreatureCollection;
var Action = MeteorApp.lib.ActionCollection;
Meteor.methods({
    moveCreature: function(id, position) {
        var creature = Creature.findOne({_id: id});
        creature.x = position.x;
        creature.y = position.y;

        Creature.update(id, creature);

        Action.insert({
            type: 'Backend:creatureMoved',
            params: {
                id: id,
                position: position
            }
        });
    }
});
