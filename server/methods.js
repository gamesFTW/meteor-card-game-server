var red = '0xff8888';
var yellow = '0xffff88';
var blue = '0x8888ff';
var green = '0x88ff88';


function addCardsToPlayer(gameId, ownerId, color, handCardsNumber) {
    let deck = MeteorApp.Decks.findOne(ownerId);
    var allCards = deck.cards.map(
        (cardId) => MeteorApp.Cards.findOne(cardId)
    );
    
    allCards = lodash.shuffle(allCards);
    
    var initialHandCards = deck.handCards.map(
        (cardId) => MeteorApp.Cards.findOne(cardId)
    );
    

    var handCards = lodash.take(allCards, handCardsNumber);
    var deckCards = lodash.drop(allCards, handCardsNumber);
    
    //initial cards from handCards
    initialHandCards.forEach(
        (card) => Meteor.call('createCardFromData', gameId, card, ownerId, 'hand', color)
    );

    //hand creatures
    handCards.forEach(
        (card) => Meteor.call('createCardFromData', gameId, card, ownerId, 'hand', color)
    );

    //deck
    deckCards.forEach(
        (card) => Meteor.call('createCardFromData', gameId, card, ownerId, 'deck', color)
    );
}


Meteor.methods({
    removeGameById: function(gameId) {
        MeteorApp.Games.remove(gameId);
        MeteorApp.CardsInGame.remove({gameId: gameId});
        MeteorApp.Actions.remove({});
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
        addCardsToPlayer(game._id, game.playerId1, red, 7);
        addCardsToPlayer(game._id, game.playerId2, blue, 8);

        if (game.type == 'ogre') {
            addCardsToPlayer(game._id, game.playerId3, yellow, 7);
            addCardsToPlayer(game._id, game.playerId4, green, 8);
        }
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
