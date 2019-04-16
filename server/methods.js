function getCardsByIds(cardsIds) {
    const cards = MeteorApp.Cards.find({ _id : { $in : cardsIds }}).fetch();
    const count = lodash.countBy(cardsIds);

    return cards.reduce((allCards, card) => {
            card.image = MeteorApp.Images.findOne(card.imageId).url();
            lodash.range(count[card._id]).forEach((i) => {
                allCards.push(card);
            });

            return allCards;
        }, []);
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

    
});
