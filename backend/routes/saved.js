const express = require('express')
const verifyToken = require('../config/verifyToken')
const savedRoute = express.Router()

savedRoute.get('/saved-tickets', verifyToken ,(req,res) => {
    
})

savedRoute.post('/post-saved-tickets', verifyToken ,(req,res) => {
    
    let data = {userId : req.user , saved : req.body}
    console.log(data)
})


module.exports = savedRoute