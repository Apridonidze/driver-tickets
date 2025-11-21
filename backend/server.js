const express = require('express');
const dataRoute = require('./routes/data');
const app = express()

const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(express.json());


const PORT = 8080 ; //move to env

app.use('/data' , dataRoute);


app.listen(PORT , () => {console.log(`http://localhost:${PORT}`)} )