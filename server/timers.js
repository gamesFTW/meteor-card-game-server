const MINUTE = 3;
const TURN_TIMERS_LIMITS = [
    {
        limit: 0,
        turnTime: Infinity
    },
    {
        limit: 5 * MINUTE,
        turnTime: 3 * MINUTE 
    },
    {
        limit: 10 * MINUTE,
        turnTime: 1.5 * MINUTE 
    },
    {
        limit: 15 * MINUTE,
        turnTime: 1 * MINUTE 
    },
    {
        limit: 20 * MINUTE,
        turnTime: 0.5 * MINUTE 
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

    MeteorApp.gameTimers.userTurnTimeLeft[gameId]--;
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

    g[playerIndex]++;
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
    
    if (getTimeLeft(gameId) < 0) {
        console.log('End of turn');
        // turnEnd;
    }
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
    
    var game = MeteorApp.Games.findOne(gameId);
    
    var playerIndex = game.turnPlayer;
    var globalPlayerTimer = game.globalTimers['player' + playerIndex];
    var currentLimit = getCurrentLimit(globalPlayerTimer);
    
    setTimeLeft(gameId, TURN_TIMERS_LIMITS[currentLimit].turnTime);
    setGlobalTimer(gameId, playerIndex, globalPlayerTimer);
    
    var interval = setInterval(Meteor.bindEnvironment(() => {
           globalTimerTick(gameId);
    }), 1000);
    
    MeteorApp.gameTimers.intervals[gameId] = interval;
};


function getCurrentLimit(globalTimer) {
    var currentLimit = 0;
    lodash.forEach(TURN_TIMERS_LIMITS, (item, i) => {
        if (globalTimer >= item.limit) {
            currentLimit = i;
        }
    });
    return currentLimit;
}


MeteorApp.Games.find({ paused: false, started: true}).forEach(game => {
    MeteorApp.startGameTimer(game._id);
});
