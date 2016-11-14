// var ddpEvents = new EventDDP('raix:push');
//
// // Added list of userId's - the selector is optional - if omitted then broadcast
// setInterval(() => {
//     ddpEvents.matchEmit('push', {
//            $and: [{
//                appId: '2222'
//            }]
//        },
//        'Hello');
// }, 3000);
//
// ddpEvents.addListener('token', function(client, token) {
//     console.log(3);
//     console.log(token);
//     if (client.userId) {
//         console.log(34);
//         // check client.appId
//         // check client.foo
//     }
// });
//
// var player1Global = 11;
// var currentLimit = limits.length - 1;
// var timeLeft = 0;
//
//
// // Происходит когда кончается ход
// onEndTurn(() => {
//     save(player1Global);
// });
//
// onStartTurn(() => {
//     player1Global = globalTimers['player1'];
//     currentLimit = 0;
//     lodash.forEach((limit, i) => {
//         if (player1Global > limit.limit && currentLimit < i) {
//             currentLimit = i;
//         }
//     });
//     timeLeft = limits[currentLimit].turnTime;
// });
//
// setInterval(() => {
//     timeLeft--;
//     player1Global++;
//     if (currentLimit === 0) {
//         if (player1Global > limits[1].limit) {
//             timeLeft = limits[1].turnTime
//         }
//     } 
//    
//     if (timeLeft <= 0) {
//         endTurn();
//     }
// });
