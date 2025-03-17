// var WebSocket = require('ws');
// var ws = new WebSocket('wss://api.tiingo.com/fx');

// let exchangeRates = { GBPUSD: 1.27, USDGBP: 0.78, TS: Date.now().toString() };
// let reconnectInterval = 1000 * 10;

// var subscribe = {
//     'eventName':'subscribe',
//     'authorization':'abb84ed861f7f5b0fb345c9eab42b123b5e03001',
//     'eventData': {
//         'thresholdLevel': 5,
//         'tickers': ['gbpusd']
//     }
// }
// export const connect = (disableReconnect = false) => {

// ws.on('open', function open() {
//     ws.send(JSON.stringify(subscribe));
// });

// ws.on("close", function () {
//     console.log(`socket closed, will reconnect in ${reconnectInterval}`);
//     if (!disableReconnect) {
//         setTimeout(() => connect(), reconnectInterval);
//     }
// });

// ws.on('message', function(data, flags) {
//     const parsedData = JSON.parse(data);
//     if(data.messageType == "A"){
//         exchangeRates.GBPUSD = parsedData.data[5];
//         exchangeRates.USDGBP = 1 / parsedData.data[5];
//         exchangeRates.TS = parsedData.data[2];
//     });
//     }

// }
// export const addSubscriber = (ws: WebSocket) => {
//     subscribers.push(ws);
// };

// export const getExchangeRates = () => {
//     return exchangeRates;
// };

// connect();
