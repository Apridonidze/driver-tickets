const express = require('express')
const verifyToken = require('../config/verifyToken')
const savedRoute = express.Router()

const db = require('../db/db')

savedRoute.get('/saved-tickets', verifyToken , async (req,res) => {

    try{

        const [ savedTickets ] = await db.query('select * from savedtickets where user_id = ?' , [req.user])

        if(savedTickets.length === 0) return res.status(200).json([])
        
        return res.status(200).json(savedTickets)

    }catch(err){
        return res.status(500).json('internal error')
    }

    
})

savedRoute.post('/post-saved-tickets', verifyToken , async (req,res) => {
    
    const data = {ticketId : req.body.data , userId : req.user}

    try{

        await db.query('insert into savedtickets (user_id , ticket_id) values (?,?)' , [ data.userId , data.ticketId ])

        return res.status(200).json('saved successfully')

    }catch(err){
        return res.status(500).json('internal error')
    }

})


savedRoute.delete('/delete-saved-tickets' , verifyToken , async (req,res) => {
    
    const data = {ticketId : req.body.data , userId : req.user}

    try{

        const [checkSaved] = await db.query('select * from savedtickets where user_id = ? and ticket_id = ?' [data.userId , data.ticketId])

        if(checkSaved.length === 0) return res.status(400).json('ticket not saved')

        await db.query('delete from savedtickets where user_id = ? , ticket_id = ?' , [data.userId , data.ticketId])

        return res.status(200).json('unsaved')

    }catch(err){
        return res.status(500).json('internal error')
    }

})


module.exports = savedRoute