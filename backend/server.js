const express = require('express'); //importing express
const app = express(); //using express as app

const cors = require('cors');
const bodyParser = require('body-parser'); //importiung cors and body-parser for CORS issues

require('dotenv').config(); //importing dotenv


const cookiesProvider = require('./routes/cookies');
const savedRoute = require('./routes/saved');
const ticketRoute = require('./routes/tickets');
const dataRoute = require('./routes/data');//importing routes
const CorsOptions = require('./config/CorsOptions');


app.use(cors(CorsOptions)) //add cors options
app.use(bodyParser.json());
app.use(express.json()); //using express body-parser,  cors to ensure backend safety from another source attacks


const PORT = process.env.PORT; //importing server port from .env file

app.use('/data' , dataRoute);
app.use('/cookies' , cookiesProvider);
app.use('/saved' , savedRoute);
app.use('/tickets', ticketRoute); //defining routes 


app.listen(PORT , () => {console.log(`http://localhost:${PORT}`)} ); //listening to port to check if backend is running 