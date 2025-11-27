const express = require('express'); //importing express
const app = express(); //using express as app

const cors = require('cors');
const bodyParser = require('body-parser'); //importiung cors and body-parser for CORS issues

require('dotenv').config(); //importing dotenv


const cookiesProvider = require('./routes/cookies');
const savedRoute = require('./routes/saved');
const ticketRoute = require('./routes/tickets');
const dataRoute = require('./routes/data');//importing routes

const CorsOptions = require('./config/CorsOptions');//importing cors options


app.use(cors(CorsOptions)) //add cors options
app.use(bodyParser.json());
app.use(express.json()); //using express body-parser,  cors to ensure backend safety from another source attacks



app.get('/', (req,res) => {
    res.send('Welcome To Driver Tickets Server')
})

app.use('/data' , dataRoute);
app.use('/cookies' , cookiesProvider);
app.use('/saved' , savedRoute);
app.use('/tickets', ticketRoute); //defining routes 

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
});