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

        
        const [ isAlreadyInserted ] = await db.query('select * from answeredtickets where ticketId = ? and user_id = ?' , [data.answeredTicket.ticketId , data.userId])

        if(isAlreadyInserted.length > 0) return res.status(400).json('Ticket Already Inserted')

        await db.query('insert into answeredTickets (user_id, ticketId, answerId, correctId) values ( ? , ? , ? , ? )' , [data.userId ,data.answeredTicket.ticketId , data.answeredTicket.answerId , data.answeredTicket.correctId])
        
        return res.status(200).json(`ticket inserted successfully`)

    }catch(err){
        return res.status(500).json('internal error')
    }

})

ticketRoute.delete('/delete-answered-tickets' , verifyToken , async(req,res) => {


    console.log(req.user)
    

})


module.exports = ticketRoute