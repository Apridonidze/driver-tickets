const express = require('express')
const dataRoute = express.Router()

const tickets = require('../data/tikets.json')
const audio = require('../data/audio')
const imgs  = require('../data/tickets')

dataRoute.get('/', async (req,res) => {
    try {

        return res.status(200).json({tickets : tickets , audio : audio , imgs : imgs})

    }catch(err){
        return res.status(500).json('internal error')
    }
})


module.exports = dataRoute