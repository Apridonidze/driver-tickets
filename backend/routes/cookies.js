const express = require('express')
const cookiesProvider = express.Router()

cookiesProvider.get('/' , (req,res) => {
    console.log('cookies provider')
})


module.exports = cookiesProvider