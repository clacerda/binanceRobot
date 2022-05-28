const express = require('express');
const app = express();
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', (req, res) =>{
    console.log('entrou')
    res.render('app', {
        symbol : process.env.SYMBOL,
        profitability: process.env.PROFITABILITY,
        lastUpdate: new Date() 
    });
});

app.listen(process.env.PORT, () =>{
    console.log("App rodando")
});