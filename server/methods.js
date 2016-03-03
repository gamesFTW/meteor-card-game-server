var red = '0xff8888';
var yellow = '0xffff88';
var blue = '0x8888ff';
var green = '0x88ff88';


function addCardsToPlayer(ownerId, color, handCards, deckCards) {
    //hand heroes
    for (var i = 0; i < 3; i++) {
        Meteor.call('createCardFromData', _.sample(cards.heroes), ownerId, 'hand', color);
    }

    //hand creatures
    for (i = 0; i < handCards; i++) {
        Meteor.call(
            'createCardFromData', _.sample(cards.creatures), ownerId, 'hand', color
        );
    }

    //hand areas
    for (i = 0; i < 4; i++) {
        Meteor.call(
            'createCardFromData', cards.creatures[0], ownerId, 'hand', color
        );
    }

    //deck
    for (i = 0; i < deckCards; i++) {
        Meteor.call(
            'createCardFromData', _.sample(cards.creatures), ownerId, 'deck', color
        );
    }
}


Meteor.methods({
    dropBase: function() {
        MeteorApp.Card.remove({});
        MeteorApp.Action.remove({});
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

        addCardsToPlayer('1', red, 8, 42);
        addCardsToPlayer('2', blue, 10, 40);
    },


    ogre: function() {
        Meteor.call('dropBase');

        addCardsToPlayer('1', red, 8, 42);
        addCardsToPlayer('2', blue, 10, 40);
        addCardsToPlayer('3', yellow, 8, 42);
        addCardsToPlayer('4', green, 10, 40);
    },


    createCardFromData: function(cardData, ownerId, cardGroup, color) {
        cardData.ownerId = ownerId;
        cardData.cardGroup = cardGroup;
        cardData.color = color;

        cardData.counter = cardData.counter || 0;
        cardData.attachable = _.contains(['spell', 'area'], cardData.type);
        cardData.maxHealth = cardData.health;
        cardData.attachedCards = [];

        MeteorApp.Card.insert(cardData);
    }
});
