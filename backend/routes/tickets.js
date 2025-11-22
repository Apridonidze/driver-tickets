const express = require('express')
const verifyToken = require('../config/verifyToken')
const ticketRoute = express.Router()

ticketRoute.get('/answered-tickets' , (req,res) => {
    
})

ticketRoute.post('/post-answered-tickets' , verifyToken, async (req,res) => {
    
    
    try{
        
        let data = {userId : req.user , answeredTicket : req.body.answeredTicket.map(ticket => ticket)}


    }catch(err){
        return res.status(500).json('interval error')
    }

})



module.exports = ticketRoute