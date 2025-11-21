const express = require('express')
const app = express()

const PORT = 8080 ; //move to env


app.get('/' , (req,res) => {
    res.send('/')
})



app.listen(PORT , () => {console.log(`http://localhost:${PORT}`)} )