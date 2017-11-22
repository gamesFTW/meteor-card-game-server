let ddpEvents = new EventDDP('raix:push');


const MINUTE = 60;
const TURN_TIMERS_LIMITS = [
    {
        limit: 0,
        turnTime: Infinity
    },
    {
        limit: 6 * MINUTE,
        turnTime: 3 * MINUTE 
    },
    {
        limit: 12 * MINUTE,
        turnTime: 2 * MINUTE 
    },
    {
        limit: 18 * MINUTE,
        turnTime: 1.25 * MINUTE 
    },
    {
        limit: 22 * MINUTE,
        turnTime: 1 * MINUTE
    }
];

MeteorApp.gameTimers = {
    intervals: {},
    userTurnTimeLeft: {},
    userGlobalTime: {}
};


function getTimeLeft(gameId) {
    let g = MeteorApp.gameTimers.userTurnTimeLeft[gameId];
    
    console.assert(g !== undefined, "No timeLeft for game", gameId);

    return g;
}


function decrementTimeLeft(gameId) {
    let g = MeteorApp.gameTimers.userTurnTimeLeft[gameId];

    console.assert(g !== undefined, "No timeLeft for game", gameId);

    // Возможно нет смысла считать в минус, но если перестать считать, то
    // конец хода может срабатывать несколько раз.
    MeteorApp.gameTimers.userTurnTimeLeft[gameId]--;
}


function setTimeLeft(gameId, value) {
    MeteorApp.gameTimers.userTurnTimeLeft[gameId] = value;
}


function getGlobalTime(gameId, playerIndex) {
    let g = MeteorApp.gameTimers.userGlobalTime[gameId];
    
    console.assert(g !== undefined, "No globalTime for game", gameId);
    console.assert(g[playerIndex] !== undefined, "No globalTime for game", gameId, "player", playerIndex);

    return g[playerIndex];
}


function incrementGlobalTime(gameId, playerIndex) {
    let g = MeteorApp.gameTimers.userGlobalTime[gameId];

    console.assert(g !== undefined, "No globalTime for game", gameId);
    console.assert(g[playerIndex] !== undefined, "No globalTime for game", gameId, "player", playerIndex);

    // Если пользователь АФК(браузер не в игре) - конец хода не произойдет и глобальный таймер у пользователя будет рости впустую
    if (getTimeLeft(gameId) > 0) {
        g[playerIndex]++;
    }
}


function setGlobalTimer(gameId, playerIndex, value) {
    let u = MeteorApp.gameTimers.userGlobalTime;
    
    u[gameId] = u[gameId] === undefined ? {} : u[gameId];
    u[gameId][playerIndex] = value;
}


function globalTimerTick(gameId) {
    let game = MeteorApp.Games.findOne(gameId);
    let playerIndex = game.turnPlayer;
    let playerId = game['playerId' + playerIndex];
    
    let globalTimer = getGlobalTime(gameId, playerIndex);
    
    // Если был достигнут первый лимит нужно убрать из timeLeft Infinity и поставить turnTime от следующего лимита
    let itWasFirstLimit = globalTimer < TURN_TIMERS_LIMITS[1].limit;
    incrementGlobalTime(gameId, playerIndex);
    
    let currentLimit = getCurrentLimit(getGlobalTime(gameId, playerIndex));
    
    if (itWasFirstLimit && currentLimit === 1) {
        setTimeLeft(gameId, TURN_TIMERS_LIMITS[currentLimit].turnTime);
    }
    
    decrementTimeLeft(gameId);
    
    let globalTimersToSend = {};
    globalTimersToSend[game['playerId1']] = getGlobalTime(gameId, 1);
    globalTimersToSend[game['playerId2']] = getGlobalTime(gameId, 2);
    
    sendTimersDataToClient(gameId, {
        timeLeft: getTimeLeft(gameId),
        globalTimers: globalTimersToSend
    });
    
    if (getTimeLeft(gameId) == 0) {
        // End of turn
        Meteor.call('addEndOfTurnEvent', gameId, playerId);
    }
}


function sendTimersDataToClient(gameId, timersData) {
    ddpEvents.matchEmit('timerTicked', {
           $and: [{
               gameId: gameId 
           }]
       },
       timersData
    ); 
}


MeteorApp.gameTimers.saveGlobalTimerForPlayer = function (gameId, playerIndex) {
    let newGlobalTimer = getGlobalTime(gameId, playerIndex);
    let key = 'player' + playerIndex;
    let game = MeteorApp.Games.findOne(gameId);
    game.globalTimers[key] = newGlobalTimer;
    MeteorApp.Games.update(gameId, game);
};


let setNewTimeLeft = MeteorApp.gameTimers.setNewTimeLeft = function (gameId) {
    let game = MeteorApp.Games.findOne(gameId);

    let playerIndex = game.turnPlayer;
    let globalPlayerTimer = game.globalTimers['player' + playerIndex];
    let currentLimit = getCurrentLimit(globalPlayerTimer);
    setTimeLeft(gameId, TURN_TIMERS_LIMITS[currentLimit].turnTime);
};



function setInitialGlobalTimers(gameId) {
    let game = MeteorApp.Games.findOne(gameId);
    setGlobalTimer(gameId, 1, game.globalTimers['player' + 1]);
    setGlobalTimer(gameId, 2, game.globalTimers['player' + 2]);
    
    if (game.type != 'solo') {
        setGlobalTimer(gameId, 3, game.globalTimers['player' + 3]);
        setGlobalTimer(gameId, 4, game.globalTimers['player' + 4]);
    }
}


function getCurrentLimit(globalTimer) {
    let currentLimit = 0;
    lodash.forEach(TURN_TIMERS_LIMITS, (item, i) => {
        if (globalTimer >= item.limit) {
            currentLimit = i;
        }
    });
    return currentLimit;
}


MeteorApp.stopGameTimer = function (gameId) {
    let game = MeteorApp.Games.findOne(gameId);

    if (MeteorApp.gameTimers.intervals[game._id]) {
        clearInterval(MeteorApp.gameTimers.intervals[game._id]);

        let timeLeft = getTimeLeft(gameId);
        if (timeLeft !== undefined) {
            game.timeLeftSavedDuringPause = timeLeft;
        } else {
            game.timeLeftSavedDuringPause = null;
        }
        MeteorApp.Games.update(gameId, game);

        MeteorApp.gameTimers.saveGlobalTimerForPlayer(gameId, game.turnPlayer);

        delete MeteorApp.gameTimers.intervals[game._id];
    } else {
        console.warn('Interval for', game._id, 'not found');
    }
};


MeteorApp.startGameTimer = function (gameId) {
    let game = MeteorApp.Games.findOne(gameId);

    if (MeteorApp.gameTimers.intervals[gameId]) {
        console.warn('Game', gameId, 'started yet');
        return;
    }

    setInitialGlobalTimers(gameId);

    if (game.timeLeftSavedDuringPause == null) {
        setNewTimeLeft(gameId);
    } else {
        setTimeLeft(gameId, game.timeLeftSavedDuringPause);
    }

    let interval = setInterval(Meteor.bindEnvironment(() => {
        globalTimerTick(gameId);
    }), 1000);

    MeteorApp.gameTimers.intervals[gameId] = interval;
};


MeteorApp.Games.find({ paused: false, started: true}).forEach(game => {
    MeteorApp.startGameTimer(game._id);
});
