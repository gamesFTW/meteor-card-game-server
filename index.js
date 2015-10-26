Units = new Mongo.Collection("units");

if (Meteor.isClient) {
    Units.find().observe({
        added: function (unit) {
            //console.log('added', unit);

            //console.log(main);
            //addUnit(unit.number, unit.x, unit.y, unit._id);
        },

        changed: function (newUnit, oldUnit) {
            //console.log('new ', newUnit);
            //console.log('old ', oldUnit);
            //units.forEach(function (u) {
            //  if (u.userData._id == newUnit._id) {
            //    u.x = newUnit.x;
            //    u.y = newUnit.y;
            //  }
            //});
        }
    });
}
