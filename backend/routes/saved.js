const express = require('express')
const verifyToken = require('../config/verifyToken')
const savedRoute = express.Router()

const db = require('../db/db')

savedRoute.get('/saved-tickets', verifyToken ,(req,res) => {
    
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


module.exports = savedRoute