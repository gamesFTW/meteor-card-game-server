function addCardsToPlayer(gameId, ownerId, color, handCardsNumber, manaPoolCardsNumber) {
    let deck = MeteorApp.Decks.findOne(ownerId);
    var allCards = deck.cards.map(
        (cardId) => MeteorApp.Cards.findOne(cardId)
    );
    
    allCards = lodash.shuffle(allCards);
    
    // Те каты которые мы добавляем как изначальные(герои и арии)
    var initialHandCards = deck.handCards.map(
        (cardId) => MeteorApp.Cards.findOne(cardId)
    );

    var handCards = lodash.take(allCards, handCardsNumber);
    var deckCards = lodash.drop(allCards, handCardsNumber);
    var manaPoolCards = [];
    
    // Переносим карты из деки в манапул
    for(var i = 0; i < manaPoolCardsNumber; i++) {
        manaPoolCards.push(deckCards.pop());
    }
    
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
    
    //deck
    manaPoolCards.forEach(
        (card) => Meteor.call('createCardFromData', gameId, card, ownerId, 'manaPool', color)
    );
}

function getCardsByIds(cardsIds) {
    return MeteorApp.Cards.find({ _id : { $in : cardsIds }})
        .fetch()
        .map((card) => {
            card.id = card._id;
            return card;
        });
}

Meteor.methods({
    createGame: function(deckId1, deckId2) {
        let gameServerId;
        const deck1 = MeteorApp.Decks.findOne(deckId1);
        const deck2 = MeteorApp.Decks.findOne(deckId2);

        try {
            const data = {
                playerA: {deck: getCardsByIds(deck1.cards), heroes: getCardsByIds(deck1.handCards)},
                playerB: {deck: getCardsByIds(deck2.cards), heroes: getCardsByIds(deck2.handCards)},
            };
            gameServerId = HTTP.call('POST', CONFIG['gameServerCreateGameURL'], {
                data
            }).data.gameId;
        } catch(e) {
            Meteor.call('removeGameById', ourId);
            throw e;
        }

        const ourId = MeteorApp.createLobbyGame(deckId1, deckId2, gameServerId);
        
        return ourId;
    },

    removeGameById: function(gameId) {
        MeteorApp.Games.remove(gameId);
    },


    startGame: function(game) {
        addCardsToPlayer(game._id, game.playerId1, '1', 9, 0);
        addCardsToPlayer(game._id, game.playerId2, '2', 9, 0);

        if (game.type == 'ogre') {
            addCardsToPlayer(game._id, game.playerId3, '3', 9, 0);
            addCardsToPlayer(game._id, game.playerId4, '4', 9, 0);
        }

        // Save initial state for replay
        MeteorApp.Games.update(game._id, {
            $set: {
                initialStateCards: MeteorApp.CardsInGame.find({ gameId: game._id }).fetch()
                }
            }
        );
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
        //cardData.rotated = false;

        if (cardGroup == 'manaPool') {
            cardData.tapped = false;
        }

        return MeteorApp.CardsInGame.insert(cardData);
    },
});
