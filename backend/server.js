const express = require('express');
const dataRoute = require('./routes/data');
const app = express()

const cors = require('cors')
const bodyParser = require('body-parser');
const cookiesProvider = require('./routes/cookies');

app.use(cors())
app.use(bodyParser.json())
app.use(express.json());


const PORT = 8080 ; //move to env

app.use('/data' , dataRoute);
app.use('/cookies' , cookiesProvider);

app.listen(PORT , () => {console.log(`http://localhost:${PORT}`)} )