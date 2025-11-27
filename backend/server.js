const express = require('express'); // importing express
const app = express();
const cors = require('cors');
require('dotenv').config(); // importing dotenv

const path = require('path'); // <-- add this

// Routes
const cookiesProvider = require('./routes/cookies');
const savedRoute = require('./routes/saved');
const ticketRoute = require('./routes/tickets');
const dataRoute = require('./routes/data');

// CORS options
const CorsOptions = require('./config/CorsOptions');

// Middleware
app.use(cors(CorsOptions));
app.use(express.json()); // parses JSON requests

// API Routes
app.use('/data', dataRoute);
app.use('/cookies', cookiesProvider);
app.use('/saved', savedRoute);
app.use('/tickets', ticketRoute);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
