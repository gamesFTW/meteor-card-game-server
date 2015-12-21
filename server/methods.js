Meteor.methods({
    dropBase: function() {
        MeteorApp.Card.remove({});
    }
});
