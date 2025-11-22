const express = require('express')
const verifyToken = require('../config/verifyToken')
const savedRoute = express.Router()

savedRoute.get('/saved-tickets', verifyToken ,(req,res) => {
    
})

savedRoute.post('/post-saved-tickets', verifyToken ,(req,res) => {
    console.log(req.body)
})


module.exports = savedRoute