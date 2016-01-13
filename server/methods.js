var red = '0xff0000';
var blue = '0x0000ff';

Meteor.methods({
    dropBase: function() {
        MeteorApp.Card.remove({});
        MeteorApp.Action.remove({});
    },
    load: function() {
        Meteor.call('dropBase');

        //hands
        for (var i = 0; i < 8; i++) {
            Meteor.call('createCard', {
                ownerId: '1',
                cardGroup: 'hand',
                color: red
            });
        }
        for (i = 0; i < 8; i++) {
            Meteor.call('createCard', {
                ownerId: '2',
                cardGroup: 'hand',
                color: blue
            });
        }
        //decks
        for (i = 0; i < 5; i++) {
            Meteor.call('createCard', {
                ownerId: '1',
                cardGroup: 'deck',
                color: red
            });
        }
        for (i = 0; i < 5; i++) {
            Meteor.call('createCard', {
                ownerId: '2',
                cardGroup: 'deck',
                color: blue
            });
        }
    },
    createCard: function(params) {
        var hp = _.sample([1, 3, 4]);

        var data = _.defaults(params, {
            title: _.sample(['Жирный орк', 'Тонкий орк', 'Средний орк']),
            type: 'creature',
            text: 'Любит есть',
            x: _.sample([1, 2, 3]),
            y: _.sample([1, 2, 3]),
            dmg: _.sample([1, 2, 3]),
            health: hp,
            maxHealth: hp,
            img: [1, 2, 3].map(i => 'card/orc' + i),
            cardGroup: _.sample(['hand', 'deck', 'table']),
            ownerId: _.sample(['1', '2']),
            isTapped: false,
            color: _.sample([red, blue])
        });

        MeteorApp.Card.insert(data);
    }
});
