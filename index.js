const api = require("./api");
const symbol = process.env.SYMBOL;
const profitability = parseFloat(process.env.PROFITABILITY);
const coin = process.env.COIN;
const goodbuy = process.env.GOODBUY;
const goodsell = process.env.GOODSELL;
 
setInterval( async () => {
    const result = await api.depth(symbol);

    let buy = 0;
    let sell = 0;

    if (result.bids &&  result.bids.length) {
        console.log(`Highest buy: ${result.bids[0][0]}`);
        buy = parseFloat(result.bids[0][0]);
    }

    if (result.asks &&  result.asks.length) {
        console.log(`Lowest sell: ${result.asks[0][0]}`);
        sell = parseFloat(result.asks[0][0]);
    } 

    if(sell > 0 && sell < goodbuy) {
        console.log('Comprar');

        const account = await api.accountInfo();
        let coins = account.balances.filter(b => symbol.indexOf(b.asset) !== -1);
 
            console.log(`POSIÇÃO DE CARTEIRA::`);
            console.log(coins);

            console.log('Verificando carteira...');
            const walletCoin = parseFloat(coins.find(c => c.asset === coin).free);
            const quantia = parseFloat((walletCoin / sell) - 0.00001).toFixed(5); // Calc de quantidade.
            console.log("Quantia de dinheiro: " + quantia)
            if (quantia > 0) {
                console.log('Dinheiro sulficiente, comprando...');
                const buyOrder = await api.newOrder(symbol, quantia);
                console.log(`orderId: ${buyOrder.orderId}`);
                console.log(`status: ${buyOrder.status}`);
 
            }
       
        

    }else if(buy && buy > goodsell){
                console.log('Posicionando venda futura...');
                const price = parseFloat(sell * profitability).toFixed(8);
                console.log(`Vendendor por ${price} (${profitability})`);
                const sellOrder = await api.newOrder(symbol, 1, price, 'SELL', 'LIMIT');
                console.log(`orderId: ${sellOrder.orderId}`);
                console.log(`status: ${sellOrder.status}`);
    }else{
        console.log("Aguardando mercado se movimentar.")
    }

  ///  console.log(await api.exchangeInfo());

}, process.env.CRAWLER_INTERVAL);