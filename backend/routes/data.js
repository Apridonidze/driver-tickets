const express = require('express')
const dataRoute = express.Router()


dataRoute.get('/', (req,res) => {
    return res.status(200).json('data route')
})


module.exports = dataRoute