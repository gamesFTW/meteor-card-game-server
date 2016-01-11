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
                cardGroup: 'hand'
            });
        }
        for (i = 0; i < 8; i++) {
            Meteor.call('createCard', {
                ownerId: '2',
                cardGroup: 'hand'
            });
        }
        //decks
        for (i = 0; i < 5; i++) {
            Meteor.call('createCard', {
                ownerId: '1',
                cardGroup: 'deck'
            });
        }
        for (i = 0; i < 5; i++) {
            Meteor.call('createCard', {
                ownerId: '2',
                cardGroup: 'deck'
            });
        }
    },
    createCard: function(params) {
        var data = _.defaults(params, {
            title: _.sample(['Жирный орк', 'Тонкий орк', 'Средний орк']),
            type: 'creature',
            text: 'Любит есть',
            x: _.sample([1, 2, 3]),
            y: _.sample([1, 2, 3]),
            dmg: _.sample([1, 2, 3]),
            health: _.sample([1, 3, 4]),
            img: [1, 2, 3].map(i => 'card/orc' + i),
            cardGroup: _.sample(['hand', 'deck', 'table']),
            ownerId: _.sample(['1', '2']),
            isTapped: false
        });

        MeteorApp.Card.insert(data);
    }
});
