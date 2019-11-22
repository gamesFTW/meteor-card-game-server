function isAIDeck(deck) {
    return deck.name.startsWith("AI");
}


function getCardsByIds(cardsIds) {
    const cards = MeteorApp.Cards.find({ _id : { $in : cardsIds }}).fetch();
    const count = lodash.countBy(cardsIds);

    return cards.reduce((allCards, card) => {
            const img = MeteorApp.Images.findOne(card.imageId)
            if (img) {
                card.image = img.url();
            }

            card.sounds = {};
            if (card.soundPackId) {
                const soundPack = MeteorApp.SoundPacks.findOne(card.soundPackId)

                if (soundPack) {
                    for (let key in soundPack.sounds) {
                        let soundId = soundPack.sounds[key];

                        if (soundId) {
                            const s = MeteorApp.Sounds.findOne(soundId);

                            if (s) {
                                card.sounds[key] = {url: s.url(), soundName: key};
                            }
                        }
                    }
                }
            }

            // ранее card.abilities был массивом, но теперь мы ждем объект
            if (Array.isArray(card.abilities) || card.abilities === null) {
                card.abilities = {};
            }
            
            lodash.range(count[card._id]).forEach((i) => {
                allCards.push(card);
            });

            return allCards;
        }, []);
}

function createGame(deckId1, deckId2) {
    let gameServerId;
    let deck1, deck2;
    // random shuffle players
    if (Math.random() >= 0.5) {
        deck1 = MeteorApp.Decks.findOne(deckId1);
        deck2 = MeteorApp.Decks.findOne(deckId2);
    } else {
        deck2 = MeteorApp.Decks.findOne(deckId1);
        deck1 = MeteorApp.Decks.findOne(deckId2);
    }

    try {
        const data = {
            playerA: {
                deck: getCardsByIds(deck1.cards),
                heroes: getCardsByIds(deck1.handCards),
                ai: isAIDeck(deck1)
            },
            playerB: {
                deck: getCardsByIds(deck2.cards),
                heroes: getCardsByIds(deck2.handCards),
                ai: isAIDeck(deck2)
            },
        };
        gameServerId = HTTP.call('POST', CONFIG['gameServerCreateGameURL'], {
            data
        }).data.gameId;
    } catch(e) {
        Meteor.call('removeGameById', ourId);
        throw e;
    }

    const ourId = MeteorApp.createLobbyGame(deck1._id, deck2._id, gameServerId);

    return ourId;
}

function createSinglePlayerGame (deckId1) {
    var aiDecks = MeteorApp.Decks.find({"name": /AI.*/}).fetch();

    if (aiDecks.length === 0) {
        throw new Error("There is no deck with name starting with 'AI'");
    }

    var deckId2 = aiDecks[0]._id;
    var lobbyGameId = createGame(deckId1, deckId2);
    var lobbyGame = MeteorApp.Games.findOne({"_id": lobbyGameId});

    var gameData = HTTP.call('get', CONFIG['gameServerGetGameURL'], {
        params: {gameId: lobbyGame.gameServerId}
    }).data;

    var playerId;
    var aiId;
    if (lobbyGame.deckId1 === deckId1) {
        playerId = gameData.player1.id;
        aiId = gameData.player2.id;
    } else if (lobbyGame.deckId2 === deckId1) {
        playerId = gameData.player2.id;
        aiId = gameData.player1.id;
    } else {
        throw new Error("Something going wrong");
    }

    return {
        lobbyGameId: lobbyGameId,
        gameServerId: gameData.game.id,
        playerId: playerId,
        aiId: aiId
    }
}

Meteor.methods({
    createSinglePlayerGame: createSinglePlayerGame,

    createGame: createGame,

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
