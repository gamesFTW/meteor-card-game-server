MeteorApp = MeteorApp || {};

Meteor.methods({
    addEndOfTurnEvent: function(gameId, playerId) {
        let game = MeteorApp.Games.findOne(gameId);
        let currentPlayerIndex = game.turnPlayer;

        let currentPlayerId = game['playerId' + currentPlayerIndex];
        if (currentPlayerId != playerId) {
            console.warn(`Player ${playerId} cant end opponent tourn`);
            return;
        }

        let lastPlayerId = getLastPlayerId(game);
        let gameTurnNumber = getGameTurnNumber(gameId, lastPlayerId); 
        let isNewGameTurnNumber = gameTurnNumber !== game.turnNumber;
        
        // Insert Event
        MeteorApp.Actions.insert({
            gameId: gameId,
            type: 'Backend:endOfPlayerTurn',
            datetime: new Date(),
            params: {
                playerId: playerId 
            }
        });

        makeUntap(gameId, playerId);
        drawCards(gameId, playerId);

        // Update turn number
        if (isNewGameTurnNumber) {
            updateGameTurnNumber(gameId, gameTurnNumber);
        }

        if (game.timeLeftSavedDuringPause !== null) {
            MeteorApp.Games.update(gameId, { $set: { timeLeftSavedDuringPause: null } });
        }

        // Change current player
        changeCurentPlayerInGame(gameId);
        // Update server game timers
        MeteorApp.gameTimers.setNewTimeLeft(gameId);
        MeteorApp.gameTimers.saveGlobalTimerForPlayer(gameId, currentPlayerIndex);

        // Оповещаем пользователй что новый глобальный ход(последний игрок сходил) 
        if (isNewGameTurnNumber) {
            MeteorApp.Actions.insert({
                gameId: gameId,
                type: 'Backend:endOfGameTurn',
                datetime: new Date(),
                params: {
                    number: gameTurnNumber
                }
            });
        }
    }
});


function makeUntap(gameId, playerId) {
    let numberOfManaToUntap = 4;
    
    // Untap mana
    Meteor.call('untapCardsInManaPool', gameId, playerId, numberOfManaToUntap);

    // Untap all table cards
    Meteor.call('untapCardsInTable', gameId, playerId);
}


function drawCards(gameId, playerId) {
    let cardPerTurn = 1;
    Meteor.call('playerDrawRandomCards', gameId, playerId, cardPerTurn);
}


function changeCurentPlayerInGame(gameId) {
    let game = MeteorApp.Games.findOne(gameId);
    let currentPlayerIndex = game.turnPlayer;
    let nextPlayerIndex = null; 
    
    
    let lastPlayerIndex = getLastPlayerIndex(game);
    if (currentPlayerIndex == lastPlayerIndex) {
         nextPlayerIndex = 1;
    } else {
         nextPlayerIndex = currentPlayerIndex + 1;
    }

    MeteorApp.Games.update(gameId, { $set: { turnPlayer: nextPlayerIndex} });
}


function updateGameTurnNumber(gameId, gameTurnNumber) {
    MeteorApp.Games.update(gameId, { $set: { turnNumber: gameTurnNumber } });
}


function getLastPlayerIndex(game) {
    return game.type == 'solo' ? 2 : 4;
}


function getLastPlayerId(game) {
    // Определяет какой из игроков ходит последним 
    return game.type == 'solo' ? game.playerId2 : game.playerId4;
}


function getGameTurnNumber(gameId, lastPlayerId) {
        // Ищет сколько раз ходил последний игрок
        let endOfTurnEventsCount = MeteorApp.Actions.find({
            gameId: gameId,
            type: 'Backend:endOfPlayerTurn',
            'params.playerId': lastPlayerId 
        }).count();
        
        // Для третьего хода, будет два эвента об окончании хода, так делаем ++
        return endOfTurnEventsCount + 1; 
}
