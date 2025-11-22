const express = require('express')
const ticketRoute = express.Router()

ticketRoute.get('/answered-tickets' , (req,res) => {
    
})

ticketRoute.post('/post-answered-tickets' , (req,res) => {
    console.log(req.body)
})



module.exports = ticketRoute