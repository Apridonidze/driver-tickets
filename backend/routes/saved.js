const express = require('express')
const savedRoute = express.Router()

savedRoute.get('/saved-tickets', (req,res) => {
    
})

savedRoute.post('/post-saved-tickets', (req,res) => {
    console.log(req.body)
})


module.exports = savedRoute