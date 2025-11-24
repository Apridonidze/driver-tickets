const express = require('express')
const verifyToken = require('../config/verifyToken')
const savedRoute = express.Router()

savedRoute.get('/saved-tickets', verifyToken ,(req,res) => {
    
})

savedRoute.post('/post-saved-tickets', verifyToken , async (req,res) => {
    
    const data = {ticketId : req.body.data , userId : req.user}

    try{

        

    }catch(err){
        return res.status(500).json('internal error')
    }

})


module.exports = savedRoute