Template.decks.helpers({
    decks: function() {
        return MeteorApp.Decks.find({});
    }
});


Template.decks.events({
    "submit .deck-name": function(e) {
        e.preventDefault();

        Meteor.call('createDeck', e.target.deckName.value);
    },
    "click .remove-deck": function(e) {
        if (confirm('Точно удалить?!')) {
            MeteorApp.Decks.remove(this._id);
        }
    }
});
