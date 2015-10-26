var Creature = MeteorApp.lib.field.creature.CreatureCollection;

if (Creature.find().count() == 0) {
    Creature.insert({x: 0, y: 0});
    Creature.insert({x: 0, y: 1});
    Creature.insert({x: 0, y: 2});
}
