MeteorApp.getDeck = function(playerId) {
    playerId = playerId || MeteorApp.data.playerId;
    var deck = MeteorApp.Decks.findOne({ name: playerId });
    if (!deck) {
        var deckId = MeteorApp.createDeck(playerId);
        return MeteorApp.Decks.findOne(deckId);
    }
    return deck;
};

/**
 * 
 * @param {String} playerId
 * @returns {} 
 */
MeteorApp.createDeck = function(playerId) {
    return MeteorApp.Decks.insert({ name: playerId, cards: [] });
};

MeteorApp.addCardToDeck = function(playerId, cardId) {
    var deck = MeteorApp.Decks.findOne({name: playerId});
    
    deck.cards.push(cardId);
    
    MeteorApp.Decks.update(deck._id, deck);
    
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
        return MeteorApp.getDeck().cards.length;
    },
    cards: getCards,
    playerId: function() {
        return MeteorApp.data.playerId
    },
    cardsInDeck: function() {
        var deck = MeteorApp.getDeck();
        var cardsIds = deck.cards;
        return lodash.uniq(cardsIds)
            .map(function(cardId) {
                var card = MeteorApp.Cards.findOne(cardId);
                if (!card) { 
                    console.warn('There is no card', cardId, 'It will be deleted from deck.');
                    
                    var index = deck.cards.lastIndexOf(cardId);
                    index !== -1 && deck.cards.splice(index, 1);

                    MeteorApp.Decks.update(deck._id, deck);           
                } else {
                    card.quantity = cardsIds.filter(
                        function(number) {return number === cardId}
                    ).length;    
                } 
                
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
       
        MeteorApp.addCardToDeck(MeteorApp.data.playerId, card._id);
    },
    "click .card-remove-btn": function(e) {
        var card = this;
        var deck = MeteorApp.getDeck(MeteorApp.data.playerId);
        
        var index = deck.cards.lastIndexOf(card._id);
        index !== -1 && deck.cards.splice(index, 1);

        MeteorApp.Decks.update(deck._id, deck);
        
    }
});
