var red = '0xff8888';
var yellow = '0xffff88';
var blue = '0x8888ff';
var green = '0x88ff88';


function addCardsToPlayer(ownerId, color, handCardsNumber) {
    var allCards = MeteorApp.Decks.findOne({playerId: ownerId}).cards.map(
        function(cardId) {
            return MeteorApp.Cards.findOne(cardId);
    });
    var heroesCards = lodash.filter(allCards, 'hero');
    var nonHeroesCards = lodash.shuffle(lodash.reject(allCards, 'hero'));

    var chunks = lodash.chunk(nonHeroesCards, handCardsNumber);
    var handCards = chunks[0];
    var deckCards = chunks[1];

    //hand heroes
    for (var i = 0; i < heroesCards.length; i++) {
        Meteor.call('createCardFromData', heroesCards[i], ownerId, 'hand', color);
    }

    //hand creatures
    for (i = 0; i < handCards.length; i++) {
        Meteor.call(
            'createCardFromData', handCards[i], ownerId, 'hand', color
        );
    }

    //deck
    for (i = 0; i < deckCards.length; i++) {
        Meteor.call(
            'createCardFromData', deckCards[i], ownerId, 'deck', color
        );
    }
}


Meteor.methods({
    dropBase: function() {
        MeteorApp.CardsInGame.remove({});
        MeteorApp.Actions.remove({});
    },

    gameForTestImg: function() {
        Meteor.call('dropBase');
        var cardsDeal = [].concat(cards.heroes, cards.creatures);
        _.range(6, 15).forEach(function(x) {
            _.range(6, 15).forEach(function(y) {
                var card = cardsDeal ? cardsDeal.pop() : null;

                if (card) {
                    card.x = x;
                    card.y = y;
                    Meteor.call('createCardFromData', card, 1, 'table', red);
                }
            });
        });

    },


    solo: function() {
        Meteor.call('dropBase');

        addCardsToPlayer('1', red, 9);
        addCardsToPlayer('2', blue, 10);
    },


    ogre: function() {
        Meteor.call('dropBase');

        addCardsToPlayer('1', red, 9);
        addCardsToPlayer('2', blue, 10);
        addCardsToPlayer('3', yellow, 9);
        addCardsToPlayer('4', green, 10);
    },


    loadDefaultCards: function() {
        function addCard(card) {
            card.date = new Date();
            MeteorApp.Cards.insert(card);
        }

        cards.heroes.forEach(addCard);
        cards.areas.forEach(addCard);
        cards.creatures.forEach(addCard);
        cards.spells.forEach(addCard);

    },


    createCardFromData: function(cardData, ownerId, cardGroup, color) {
        delete cardData._id;
        cardData.ownerId = ownerId;
        cardData.cardGroup = cardGroup;
        cardData.color = color;

        cardData.counter = cardData.counter || 0;
        cardData.attachable = _.contains(['spell', 'area'], cardData.type);
        cardData.maxHealth = cardData.health;
        cardData.attachedCards = [];
        cardData.rotated = false;

        MeteorApp.CardsInGame.insert(cardData);
    }
});
