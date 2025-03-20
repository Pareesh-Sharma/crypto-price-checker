const express = require("express");
const axios = require("axios");

//making app
const app = express();
const port = 3000;
//middlewares
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // For parsing form data

// Home route
app.get('/', (req, res) => {
  res.render('index', { price: null, coin: null, error: null });
});

// POST route - Fetch price from CoinGecko API

app.post('/get-price', async (req, res) => {
  const coin = req.body.coin.toLowerCase();
  try{
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
    const data = response.data;

    if (data[coin] && data[coin].usd) {
      const price = data[coin].usd;
      res.render('index', { price, coin: coin.toUpperCase(), error: null });
    } else {
      res.render('index', { price: null, coin: null, error: 'Invalid coin name' });
    }
  }catch(error){
    console.log('API Error:', error.message); // Log error for debugging
    res.render('index', { price: null, coin: null, error: 'Error fetching price' });
  }
});

//listen
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
