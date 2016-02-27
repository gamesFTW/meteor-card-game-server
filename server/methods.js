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


    gameForDev: function() {
        Meteor.call('dropBase');

        //hands
        for (var i = 0; i < 8; i++) {
            Meteor.call('createRandomCard', {
                ownerId: '1',
                cardGroup: 'hand',
                color: red
            });
        }
        for (i = 0; i < 8; i++) {
            Meteor.call('createRandomCard', {
                ownerId: '2',
                cardGroup: 'hand',
                color: blue
            });
        }
        //decks
        for (i = 0; i < 40; i++) {
            Meteor.call('createRandomCard', {
                ownerId: '1',
                cardGroup: 'deck',
                color: red
            });
        }
        for (i = 0; i < 40; i++) {
            Meteor.call('createRandomCard', {
                ownerId: '2',
                cardGroup: 'deck',
                color: blue
            });
        }
        //mana
        for (i = 0; i < 1; i++) {
            Meteor.call('createRandomCard', {
                ownerId: '1',
                cardGroup: 'manaPool',
                color: blue
            });
        }
        for (i = 0; i < 1; i++) {
            Meteor.call('createRandomCard', {
                ownerId: '2',
                cardGroup: 'manaPool',
                color: red
            });
        }
    },


    createRandomCard: function(params) {
        var hp = _.sample([1, 3, 4]);

        var data = _.defaults(params, {
            title: _.sample(['Жирный орк', 'Тонкий орк', 'Средний орк']),
            type: 'creature',
            text: 'Любит есть и танцы. А еще футбол.\nА еще он любит заниматся спортом.',
            x: _.sample([1, 2, 3]),
            y: _.sample([1, 2, 3]),
            dmg: _.sample([1, 2, 3]),
            mana: _.sample([1, 2, 3]),
            counter: 0,
            health: hp,
            maxHealth: hp,
            imageName: _.sample(MeteorApp.imageFileNames),
            cardGroup: _.sample(['hand', 'deck', 'table']),
            ownerId: _.sample(['1', '2']),
            tapped: false,
            color: _.sample([red, blue])
        });

        MeteorApp.Card.insert(data);
    },


    createCardFromData: function(cardData, ownerId, cardGroup, color) {
        cardData.ownerId = ownerId;
        cardData.cardGroup = cardGroup;
        cardData.color = color;

        cardData.counter = cardData.counter || 0;
        cardData.maxHealth = cardData.health;

        MeteorApp.Card.insert(cardData);
    }
});
