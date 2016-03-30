var getDeck = function() {
    var playerId = MeteorApp.data.playerId;
    var deck = MeteorApp.Decks.findOne({ name: playerId });
    if (!deck) {
        return createDeck();
    }
    return deck;
};

var createDeck = function() {
    var playerId = MeteorApp.data.playerId;
    var deckId = Meteor.call('createDeck', playerId);
    return MeteorApp.Decks.findOne(deckId);
};

var getCards = function() {
    var title = Session.get('searchCardTitle') || '';
    var titleRe = new RegExp(title, 'i');

    var text = Session.get('searchCardText') || '';
    var textRe = new RegExp(text, 'i');

    var filter = { title: titleRe, text: textRe };

    var filterType = Session.get('filterType');
    if (filterType === 'heroes') {
        filter = lodash.assign(filter, { hero: true , type: 'creature'});
    } else if (filterType === 'creatures') {
        filter = lodash.assign(filter, { hero: false , type: 'creature'});
    } else if (filterType === 'spells') {
        filter = lodash.assign(filter, { type: 'spell'});
    } else if (filterType === 'areas') {
        filter = lodash.assign(filter, { type: 'area'});
    }

    return MeteorApp.Cards.find(
        filter,
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
    cardsInDeck: function() {
        var cardsIds = getDeck().cards;
        return lodash.uniq(cardsIds)
            .map(function(cardId) {
                var card = MeteorApp.Cards.findOne(cardId);
                card.quantity = cardsIds.filter(
                    function(number) {return number === cardId}
                ).length;
                return card;
            });
    }
});

Template.deckEdit.events({
    'keyup .card-search': function(e) {
        Session.set('searchCardTitle', e.target.value);
    },
    'click .filter-type': function(e) {
        Session.set('filterType', e.target.value);
    },
    'keyup .card-text-search': function(e) {
        Session.set('searchCardText', e.target.value);
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
        var index = deck.cards.lastIndexOf(card._id);
        index !== -1 && deck.cards.splice(index, 1);

        MeteorApp.Decks.update(deck._id, deck);
    }
});
