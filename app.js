const express = require('express');
const app = express();
const path = require('path');
const api = require('./api');
const symbol = process.env.SYMBOL;
const coin = process.env.COIN;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/data', async (req, res) =>{
    const data = {};
    const mercado = await api.depth(symbol);
    data.buy = mercado.bids.lenght ? mercado.bids[0][0] : 0;
    data.sell = mercado.asks.lenght ? mercado.asks[0][0] : 0;

    const carteira = await api.accountInfo();
    const coins =   carteira.balances.filter(b => symbol.indexOf(b.asset) !== -1);
    data.coins = coins;

    const sellPrice = parseFloat(data.sell);
    const carteiraUSD = await parseFloat(coins.find(c => c.asset.endsWith(coin)).free);
 
    const quantia = parseFloat((carteiraUSD / sellPrice) - 0.00001).toFixed(5); // Calc de quantidade.

    if (quantia < 1000) {
        if (quantia > 0) {
            const buyOrder = await api.newOrder(symbol, quantia);
            data.buyOrder = buyOrder;
    
        }
        if(buyOrder.status === 'FIELD'){
                    console.log('Posicionando venda futura...');
                    const price = parseFloat(sell * profitability).toFixed(8);
                    const sellOrder = await api.newOrder(symbol, 1, price, 'SELL', 'LIMIT');
                    data.sellOrder = sellOrder;
        }
    }
    res.json(data);

})

app.use('/', (req, res) =>{
    console.log('entrou')
    res.render('app', {
        symbol : symbol,
        profitability: process.env.PROFITABILITY,
        lastUpdate: new Date(),
        interval: parseInt(process.env.CRAWLER_INTERVAL)
    });
});

app.listen(process.env.PORT, () =>{
    console.log("App rodando")
});