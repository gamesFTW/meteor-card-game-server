var getDeck = function() {
    var playerId = MeteorApp.data.playerId;
    var deck = MeteorApp.Decks.findOne({ playerId: playerId });
    if (!deck) {
        return createDeck();
    }
    return deck;
};

var createDeck = function() {
    var playerId = MeteorApp.data.playerId;
    var deckId = MeteorApp.Decks.insert({ playerId: playerId, cards: [] });
    return MeteorApp.Decks.findOne(deckId);
};

var getCards = function() {
    var title = Session.get('searchCardTitle') || '';
    var titleRe = new RegExp(title, 'i');
    return MeteorApp.Cards.find(
        { title: titleRe },
        { sort: { type: 1, hero: -1, mana: 1 } }
    );
};


Template.deckEdit.helpers({
    deckLength: function() {
        return getDeck().cards.length;
    },
    cards: getCards,
    playerId: function() {
        return MeteorApp.data.playerId
    },
    cardsIdsInDeck: function() {
        return getDeck().cards;
    },
    getCardById: function(_id) {
        return MeteorApp.Cards.findOne(_id);
    }
});

Template.deckEdit.events({
    'keyup .card-search': function(e) {
        Session.set('searchCardTitle', e.target.value);
    }
});

Template.cardView.events({
    "click .card-add-btn": function(e) {
        var card = this;
        var deck = getDeck();
        deck.cards.push(card._id);
        MeteorApp.Decks.update(deck._id, deck);
    },
    "click .card-remove-btn": function(e) {
        var card = this;
        var deck = getDeck();
        var index = deck.cards.indexOf(card._id);
        index !== -1 && deck.cards.splice(index, 1);

        MeteorApp.Decks.update(deck._id, deck);
    }
});
