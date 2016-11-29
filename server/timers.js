const MINUTE = 2;
const TURN_TIMERS_LIMITS = [
    {
        limit: 0,
        turnTime: Infinity
    },
    {
        limit: 5 * MINUTE,
        turnTime: 4 * MINUTE 
    },
    {
        limit: 10 * MINUTE,
        turnTime: 3 * MINUTE 
    },
    {
        limit: 15 * MINUTE,
        turnTime: 2 * MINUTE 
    },
    {
        limit: 20 * MINUTE,
        turnTime: 1 * MINUTE 
    }
];

MeteorApp.gameTimers = {
    intervals: {},
    userTurnTimeLeft: {},
    userGlobalTime: {}
};


function getTimeLeft(gameId) {
    var g = MeteorApp.gameTimers.userTurnTimeLeft[gameId];
    
    console.assert(g !== undefined, "No timeLeft for game", gameId);

    return g;
}


function decrementTimeLeft(gameId) {
    var g = MeteorApp.gameTimers.userTurnTimeLeft[gameId];

    console.assert(g !== undefined, "No timeLeft for game", gameId);

    // Нет смысла считать в минус
    if (MeteorApp.gameTimers.userTurnTimeLeft[gameId] > 0) {
        MeteorApp.gameTimers.userTurnTimeLeft[gameId]--;
    } 
}


function setTimeLeft(gameId, value) {
    MeteorApp.gameTimers.userTurnTimeLeft[gameId] = value;
}


function getGlobalTime(gameId, playerIndex) {
    var g = MeteorApp.gameTimers.userGlobalTime[gameId];
    
    console.assert(g !== undefined, "No globalTime for game", gameId);
    console.assert(g[playerIndex] !== undefined, "No globalTime for game", gameId, "player", playerIndex);

    return g[playerIndex];
}


function incrementGlobalTime(gameId, playerIndex) {
    var g = MeteorApp.gameTimers.userGlobalTime[gameId];

    console.assert(g !== undefined, "No globalTime for game", gameId);
    console.assert(g[playerIndex] !== undefined, "No globalTime for game", gameId, "player", playerIndex);

    // Если пользователь АФК(браузер не в игре) - конец хода не произойдет и глобальный таймер у пользователя будет рости впустую
    if (getTimeLeft(gameId) > 0) {
        g[playerIndex]++;
    }
}


function setGlobalTimer(gameId, playerIndex, value) {
    console.log(gameId, playerIndex, value);
    var u = MeteorApp.gameTimers.userGlobalTime;
    
    u[gameId] = u[gameId] === undefined ? {} : u[gameId];
    u[gameId][playerIndex] = value;
}


function globalTimerTick(gameId) {
    console.log('Game', gameId, 'tic');
    
    var game = MeteorApp.Games.findOne(gameId);
    var playerIndex = game.turnPlayer;
    var playerId = game['playerId' + playerIndex];
    
    var globalTimer = getGlobalTime(gameId, playerIndex);
    
    // Если был достигнут первый лимит нужно убрать из timeLeft Infinity и поставить turnTime от следующего лимита
    var itWasFirstLimit = globalTimer < TURN_TIMERS_LIMITS[1].limit;
    incrementGlobalTime(gameId, playerIndex);
    
    var currentLimit = getCurrentLimit(getGlobalTime(gameId, playerIndex));
    
    if (itWasFirstLimit && currentLimit === 1) {
        setTimeLeft(gameId, TURN_TIMERS_LIMITS[currentLimit].turnTime);
    }
    
    decrementTimeLeft(gameId);
    console.log('Game', gameId, 'time', getTimeLeft(gameId), 'left');
    console.log('Game', gameId, 'user', playerIndex, 'globalTime', getGlobalTime(gameId, playerIndex));
    
    if (getTimeLeft(gameId) == 0) {
        // End of turn
        console.log('End of turn');
        Meteor.call('addTimerAlarmedEndOfTurnEvent', gameId, playerId);
    }
}

var saveGlobalTimerForPlayer = MeteorApp.gameTimers.saveGlobalTimerForPlayer = function (gameId, playerIndex) {
    let newGlobalTimer = getGlobalTime(gameId, playerIndex);
    let key = 'player' + playerIndex;
    let game = MeteorApp.Games.findOne(gameId);
    game.globalTimers[key] = newGlobalTimer;
    MeteorApp.Games.update(gameId, game);
};

var setNewTimeLeft = MeteorApp.gameTimers.setNewTimeLeft = function (gameId) {
    let game = MeteorApp.Games.findOne(gameId);

    let playerIndex = game.turnPlayer;
    let globalPlayerTimer = game.globalTimers['player' + playerIndex];
    let currentLimit = getCurrentLimit(globalPlayerTimer);
    setTimeLeft(gameId, TURN_TIMERS_LIMITS[currentLimit].turnTime);
};



function setInitialGlobalTimers(gameId) {
    var game = MeteorApp.Games.findOne(gameId);
    setGlobalTimer(gameId, 1, game.globalTimers['player' + 1]);
    setGlobalTimer(gameId, 2, game.globalTimers['player' + 2]);
    
    if (game.type != 'solo') {
        setGlobalTimer(gameId, 3, game.globalTimers['player' + 3]);
        setGlobalTimer(gameId, 4, game.globalTimers['player' + 4]);
    }
}


function getCurrentLimit(globalTimer) {
    var currentLimit = 0;
    lodash.forEach(TURN_TIMERS_LIMITS, (item, i) => {
        if (globalTimer >= item.limit) {
            currentLimit = i;
        }
    });
    return currentLimit;
}


MeteorApp.stopGameTimer = function (gameId) {
    var game = MeteorApp.Games.findOne(gameId);

    if (MeteorApp.gameTimers.intervals[game._id]) {
        clearInterval(MeteorApp.gameTimers.intervals[game._id]);
        delete MeteorApp.gameTimers.intervals[game._id];
    } else {
        console.warn('Interval for', game._id, 'not found');
    }
};


MeteorApp.startGameTimer = function (gameId) {
    if (MeteorApp.gameTimers.intervals[gameId]) {
        console.warn('Game', gameId, 'started yet');
        return;
    }

    
    setInitialGlobalTimers(gameId);
    setNewTimeLeft(gameId);

    var interval = setInterval(Meteor.bindEnvironment(() => {
        globalTimerTick(gameId);
    }), 1000);

    MeteorApp.gameTimers.intervals[gameId] = interval;
};


MeteorApp.Games.find({ paused: false, started: true}).forEach(game => {
    MeteorApp.startGameTimer(game._id);
});
