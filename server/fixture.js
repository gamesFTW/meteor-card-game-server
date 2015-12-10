var Card = MeteorApp.Card;

if (Card.find().count() == 0) {
    for(var i = 0; i < 6; i++) {
        var data = {
            title: _.sample(['Жирный орк', 'Тонкий орк', 'Средний орк']),
            type: 'creature',
            text: 'Любит есть',
            x: _.sample([1, 2, 3]),
            y: _.sample([1, 2, 3]),
            dmg: _.sample([1, 2, 3]),
            health: _.sample([1, 3, 4]),
            img: [1, 2, 3].map(i => 'card/orc' + i),
            cardGroup: _.sample(['hand', 'deck', 'table']),
            ownerId: '1'
        };

        Card.insert(data);
    }

    var data = {
            title: _.sample(['Жирный орк', 'Тонкий орк', 'Средний орк']),
            type: 'creature',
            text: 'Любит есть',
            x: _.sample([1, 2, 3]),
            y: _.sample([1, 2, 3]),
            dmg: _.sample([1, 2, 3]),
            health: _.sample([1, 3, 4]),
            img: [1, 2, 3].map(i => 'card/orc' + i),
            cardGroup: 'table',
            ownerId: '1'
    };

    Card.insert(data);

}
