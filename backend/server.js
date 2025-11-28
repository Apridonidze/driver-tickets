const express = require('express');//importing express
const app = express();//creating server

const path = require('path'); //importing path from express
const cors = require('cors');//importing cors
require('dotenv').config();//importing .env

const CorsOptions = require('./config/CorsOptions');//importing cors options object

app.use(cors(CorsOptions));//using cors with options
app.use(express.json());//importing express middelware for payloads

const cookiesProvider = require('./routes/cookies');
const savedRoute = require('./routes/saved');
const ticketRoute = require('./routes/tickets');
const dataRoute = require('./routes/data');//importing route

const PORT = process.env.PORT || 8080; //defining port from .env or 8080 by default

app.get('/', (req,res) => {
  res.send(`Welcome To Drivers-Tickets Server , Listening on Port : ${PORT} , URL : ${process.env.BACKEND_URL}, ORIGIN URL : ${process.env.ORIGIN_URL}`)
}); //returning message to / path in backend to check that backend runs correctly

app.use('/data', dataRoute);
app.use('/cookies', cookiesProvider);
app.use('/saved', savedRoute);
app.use('/answered', ticketRoute);//using routes


app.use('/audio', express.static(path.join(__dirname, 'data/audio')));
app.use('/ticket', express.static(path.join(__dirname, 'data/tickets')));//using folders as routes

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});//listening to server to check if backend runs correctly