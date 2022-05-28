const axios = require("axios");
const queryString = require("querystring");
const crypto = require("crypto"); 
const { REFUSED } = require("dns");

const apikey = process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;
const apiUrl = process.env.API_URL;

async function publicCall(path, data, method = 'GET'){
    try {
        const qs = data ? `?${queryString.stringify(data)}` : '';
        const result = await axios({
            method,
            url: `${"https://api.binance.com/api"}${path}${qs}`
        })
        return result.data;

    } catch (error) {
        console.log(error)
    }
}


async function time(){
    return publicCall('/v3/time')
}


async function depth(symbol = 'ADABRL', limit = 20){
    return publicCall('/v3/depth', {symbol, limit})
}


async function exchangeInfo(){
    return publicCall('/v3/exchangeInfo');
}

 
async function privateCall(path, data = {}, method = 'GET'){
    const timestamp = Date.now();
    const signature = crypto.createHmac('sha256', apiSecret)
                      .update(`${queryString.stringify({...data, timestamp})}`)
                      .digest('hex');

    const newData = {...data, timestamp, signature};
    const qs = `?${queryString.stringify(newData)}`;

    try {
        const result = await axios({
            method,
            url: `${apiUrl}${path}${qs}`,
            headers: {'X-MBX-APIKEY': apikey}
        })
        return result.data;

    } catch (error) {
        console.log(error)
    }

}

async function accountInfo(){
    return privateCall('/v3/account')
}

async function newOrder(symbol, quantity, price, side = 'BUY', type= 'MARKET'){
    const data = { symbol, side, type, quantity};

    if(price){
        data.price = price;
    }
    if(type === 'LIMIT'){
        data.timeInForce = 'GTC'
    }
    
    return privateCall('/v3/order', data, 'POST');
}


module.exports = {time, depth, exchangeInfo, accountInfo, newOrder}