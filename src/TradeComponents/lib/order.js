const Alpaca = require('@alpacahq/alpaca-trade-api')
const alpaca = new Alpaca({
    keyId: process.env.APIKEY,
    secretKey: process.env.SECRET,
    paper: true
})

const buyMarket = async ({symbol, amt}) => {
    // hit api to buy a market order of symbol @ amt
    await new Promise(res => {
        setTimeout(() => {
            res(alpaca.createOrder({
                symbol: symbol,
                qty: amt,
                side: 'buy',
                type: 'market',
                time_in_force: 'day'
            }));
        });
    });
};

const sellStop = async ({symbol, price, amt}) => {
    // hit api to set a stop sell order of symbol @ amt @ price
    await new Promise(res => {
        setTimeout(() => {
            res(alpaca.createOrder({
                symbol: symbol,
                qty: amt,
                side: 'sell',
                stop_price: price,
                type: 'stop',
                time_in_force: 'day'
            }));
        });
    });
};

const sellLimit = async ({symbol, price, amt}) => {
    // hit api to set a stop sell order of symbol @ amt @ price
    await new Promise(res => {
        setTimeout(() => {
            res(alpaca.createOrder({
                symbol: symbol,
                qty: amt,
                side: 'sell',
                limit_price: price,
                type: 'limit',
                time_in_force: 'day'
            }));
        });
    });
};

module.exports = {
    buyMarket, sellStop, sellLimit
};
