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
 * @param {String} name
 * @returns {} 
 */
MeteorApp.createDeck = function(name) {
    return MeteorApp.Decks.insert({
        name: name,
        cards: [],
        handCards: [],
        desc: ""
    });
};

MeteorApp.addCardToDeck = function(name, cardId) {
    var deck = MeteorApp.Decks.findOne({name: name});
    
    deck.cards.push(cardId);
    
    MeteorApp.Decks.update(deck._id, deck);
    
};

MeteorApp.addCardToHandDeck = function(name, cardId) {
    var deck = MeteorApp.Decks.findOne({name: name});
    
    if (!deck.handCards) {
        deck.handCards = [];
    }    
    
    deck.handCards.push(cardId);
    
    MeteorApp.Decks.update(deck._id, deck);
};


MeteorApp.clearDeck = (name) => {
    var deck = MeteorApp.Decks.findOne({ name: name });
    deck.cards = [];
    deck.handCards = [];
    MeteorApp.Decks.update(deck._id, deck);
};

var getCards = function() {
    var title = Session.get('searchCardTitle') || '';
    var titleRe = new RegExp(title, 'i');

    var text = Session.get('searchCardText') || '';
    var textRe = new RegExp(text, 'i');

    var filter = { title: titleRe, text: textRe, draft: false, summoned: false };

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
    
    var filterTag = Session.get('searchTag') || null;
    if (filterTag) {
        filter = lodash.assign(filter, { tags: filterTag }); 
    }

    return MeteorApp.Cards.find(
        filter,
        { sort: {  mana: 1 } }
    );
};


Template.deckEdit.helpers({
    deckLength: function() {
        let deck = MeteorApp.getDeck();
        return deck.cards.length + deck.handCards.length;
    },
    
    cards: getCards,
    
    tagsList: function () {
        var notUniqTags = MeteorApp.Cards.find().fetch().reduce((list, c) => {
            if(c.tags) {
                return list.concat(c.tags)
            }
            return list;
        }, []);

        return _.sortBy(_.uniq(notUniqTags), String);
    },
    
    playerId: function() {
        return MeteorApp.data.playerId
    },
    
    name: function() {
        let deck = MeteorApp.getDeck();
        return deck.name;
    },

    desc: function() {
        let deck = MeteorApp.getDeck();
        return deck.desc;
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
    },
    cardsInHandDeck: function() {
        var deck = MeteorApp.getDeck();
        var cardsIds = deck.handCards;
        return lodash.uniq(cardsIds)
            .map(function(cardId) {
                var card = MeteorApp.Cards.findOne(cardId);
                if (!card) { 
                    console.warn('There is no card', cardId, 'It will be deleted from deck.');
                    
                    var index = deck.handCards.lastIndexOf(cardId);
                    index !== -1 && deck.handCards.splice(index, 1);

                    MeteorApp.Decks.update(deck._id, deck);           
                } else {
                    card.quantity = cardsIds.filter(
                        function(number) {return number === cardId}
                    ).length;    
                } 
                
                return card;
            });
    },
    manaDistribution: function () {
        const MAX_MANA = 8 + 1;
        const cards = MeteorApp.getDeck().cards;
        
        
        var distribution = _.range(MAX_MANA).reduce((obj, x) => {
            obj[x]=0;
            return obj;
        }, {});
        
        
        cards.forEach(cardId => {
            var card = MeteorApp.Cards.findOne(cardId);
            if (card.mana !== undefined) {
                distribution[card.mana]++; 
            }
        });
        
        return {
            manaTitle: _.keys(distribution),
            manaCount: _.values(distribution)
        }
        
    }
    
});

Template.deckEdit.events({
    'keyup .card-search': function(e) {
        Session.set('searchCardTitle', e.target.value);
    },
    'click .filter-type': function(e) {
        Session.set('filterType', e.target.value);
    },
    'change .deckEdit__tag-selector': function (e) {
        Session.set('searchTag', e.target.value);
    },
    'blur .deckEdit__desc-area': function (e) {
        var desc = e.target.value;
        let deck = MeteorApp.getDeck();
        deck.desc = desc;
        MeteorApp.Decks.update(deck._id, deck);
    },
    'blur .deckEdit__name-area': function (e) {

        var name = e.target.value;
        Router.go(`/cards/deck/${name}/edit`);

        let deck = MeteorApp.getDeck();
        deck.name = name;
        MeteorApp.Decks.update(deck._id, deck);

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
        
    },
    "click .card-add-hand-btn": function(e) {
        var card = this;
       
        MeteorApp.addCardToHandDeck(MeteorApp.data.playerId, card._id);
    },
    "click .card-remove-hand-btn": function(e) {
        var card = this;
        var deck = MeteorApp.getDeck(MeteorApp.data.playerId);
        
        var index = deck.handCards.lastIndexOf(card._id);
        index !== -1 && deck.handCards.splice(index, 1);

        MeteorApp.Decks.update(deck._id, deck);
        
    }
});
