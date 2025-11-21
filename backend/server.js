const express = require('express');
const dataRoute = require('./routes/data');
const app = express()

const PORT = 8080 ; //move to env


app.get('/' , (req,res) => {
    res.send('/')
})

app.use('/data' , dataRoute);

app.listen(PORT , () => {console.log(`http://localhost:${PORT}`)} )