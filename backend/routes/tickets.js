const express = require('express')
const verifyToken = require('../config/verifyToken')
const ticketRoute = express.Router()

ticketRoute.get('/answered-tickets' , (req,res) => {
    
})

ticketRoute.post('/post-answered-tickets' , verifyToken, (req,res) => {
    console.log(req.body)
})



module.exports = ticketRoute