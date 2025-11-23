const express = require('express')
const verifyToken = require('../config/verifyToken')
const ticketRoute = express.Router()
const db = require('../db/db')

ticketRoute.get('/answered-tickets' , verifyToken , async (req,res) => {
    
    try{

        const userId = req.user

        const [ answeredTickets ] = await db.query('select ticketId, answerId, correctId from answeredtickets where user_id = ?',[userId])

        if(answeredTickets.length === 0) return res.status(200).json([])

        return res.status(200).json(answeredTickets)
        
    }catch(err){
        return res.status(500).json('internal error')
    }
    
})

ticketRoute.post('/post-answered-tickets' , verifyToken, async (req,res) => {
    
    
    try{
        
        let data = {userId : req.user , answeredTicket : req.body.answeredTicketLast}

        //check if user already answered ticket and return resp

        await db.query('insert into answeredTickets (user_id, ticketId, answerId, correctId) values ( ? , ? , ? , ? )' , [data.userId ,data.answeredTicket.ticketId , data.answeredTicket.answerId , data.answeredTicket.correctId])
        
        return res.status(200).json(`ticket inserted successfully`)

    }catch(err){
        return res.status(500).json('internal error')
    }

})



module.exports = ticketRoute