const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path')

const cookiesProvider = require('./routes/cookies');
const savedRoute = require('./routes/saved');
const ticketRoute = require('./routes/tickets');
const dataRoute = require('./routes/data');


const CorsOptions = require('./config/CorsOptions');


const PORT = process.env.PORT || 8080;

const app = express();


app.use(cors(CorsOptions));
app.use(express.json());

app.get('/', (req,res) => {
  res.send(`Welcome To Drivers-Tickets Server , Listening on Port${PORT} , URL : ${process.env.BACKEND_URL}`)
})

app.use('/data', dataRoute);
app.use('/cookies', cookiesProvider);
app.use('/saved', savedRoute);
app.use('/tickets', ticketRoute);


app.use('/audio', express.static(path.join(__dirname, 'data/audio')));
app.use('/ticket', express.static(path.join(__dirname, 'data/tickets')));

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
