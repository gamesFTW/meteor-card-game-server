var red = '0xff8888';
var yellow = '0xffff88';
var blue = '0x8888ff';
var green = '0x88ff88';


function addCardsToPlayer(gameId, ownerId, color, handCardsNumber) {
    var allCards = MeteorApp.Decks.findOne(ownerId).cards.map(
        function(cardId) {
            return MeteorApp.Cards.findOne(cardId);
    });
    var heroesCards = lodash.filter(allCards, 'hero');
    var nonHeroesCards = lodash.shuffle(lodash.reject(allCards, 'hero'));

    var handCards = lodash.take(nonHeroesCards, handCardsNumber);
    var deckCards = lodash.drop(nonHeroesCards, handCardsNumber);
    
    console.log('hand', ownerId, handCards.length);
    console.log('deck', ownerId, deckCards.length);

    //hand heroes
    for (var i = 0; i < heroesCards.length; i++) {
        Meteor.call('createCardFromData', gameId, heroesCards[i], ownerId, 'hand', color);
    }

    //hand creatures
    for (i = 0; i < handCards.length; i++) {
        Meteor.call(
            'createCardFromData', gameId, handCards[i], ownerId, 'hand', color
        );
    }

    //deck
    for (i = 0; i < deckCards.length; i++) {
        Meteor.call(
            'createCardFromData', gameId, deckCards[i], ownerId, 'deck', color
        );
    }
}


Meteor.methods({
    dropBase: function() {
        MeteorApp.CardsInGame.remove({});
        MeteorApp.Actions.remove({});
        MeteorApp.Cards.remove({});
    },


    removeGameById: function(gameId) {
        MeteorApp.Games.remove(gameId);
        MeteorApp.CardsInGame.remove({gameId: gameId});
        MeteorApp.Actions.remove({});
    },


    createDeck: function(name) {
        return MeteorApp.Decks.insert({ name: name, cards: [] });
    },


    gameForTestImg: function() {
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


    startGame: function(game) {
        addCardsToPlayer(game._id, game.playerId1, red, 9);
        addCardsToPlayer(game._id, game.playerId2, blue, 10);

        if (game.type == 'ogre') {
            addCardsToPlayer(game._id, game.playerId3, yellow, 9);
            addCardsToPlayer(game._id, game.playerId4, green, 10);
        }
    },


    solo: function() {
        addCardsToPlayer('1', red, 9);
        addCardsToPlayer('2', blue, 10);
    },


    ogre: function() {
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


    createCardFromData: function(gameId, cardData, ownerId, cardGroup, color) {
        delete cardData._id;
        cardData.gameId = gameId;
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
