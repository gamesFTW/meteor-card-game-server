var red = '0xff8888';
var blue = '0x8888ff';



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
        //mana
        for (i = 0; i < 1; i++) {
            Meteor.call('createCard', {
                ownerId: '1',
                cardGroup: 'manaPool',
                color: blue
            });
        }
        for (i = 0; i < 1; i++) {
            Meteor.call('createCard', {
                ownerId: '2',
                cardGroup: 'manaPool',
                color: red
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
            imageName: _.sample(MeteorApp.imageFileNames),
            cardGroup: _.sample(['hand', 'deck', 'table']),
            ownerId: _.sample(['1', '2']),
            isTapped: false,
            color: _.sample([red, blue])
        });

        MeteorApp.Card.insert(data);
    }
});
