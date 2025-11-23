const express = require('express')
const verifyToken = require('../config/verifyToken')
const ticketRoute = express.Router()
const db = require('../db/db')

ticketRoute.get('/answered-tickets' , verifyToken , async (req,res) => {
    
    try{

        return res.status(200).json(req.user) 

    }catch(err){
        return res.status(500).json('internal error')
    }
    
})

ticketRoute.post('/post-answered-tickets' , verifyToken, async (req,res) => {
    
    
    try{
        
        let data = {userId : req.user , answeredTicket : req.body.answeredTicketLast}

        let ticketQueries =  db.query('insert into answeredTickets (user_id, ticketId, answerId, correctId) values ( ? , ? , ? , ? )' , [data.userId ,data.answeredTicket.ticketId , data.answeredTicket.answerId , data.answeredTicket.correctId])
        let ticketResponse = await Promise.all(ticketQueries)


        return res.status(200).json(ticketResponse[0][0])
        

    }catch(err){
        return res.status(500).json('internal error')
    }

})



module.exports = ticketRoute