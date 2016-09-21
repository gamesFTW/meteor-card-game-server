Template.decks.helpers({
    decks: function() {
        return MeteorApp.Decks.find().fetch().reverse();
    }
});


Template.decks.events({
    "submit .deck-name": function(e) {
        e.preventDefault();
        const deckName = e.target.deckName.value;
        MeteorApp.createDeck(deckName);
        Router.go(`/cards/deck/${deckName}/edit`);
    },
    "click .remove-deck": function(e) {
        if (confirm('Точно удалить?!')) {
            MeteorApp.Decks.remove(this._id);
        }
    }
});
