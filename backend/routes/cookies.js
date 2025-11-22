const express = require('express')
const cookiesProvider = express.Router()

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");

cookiesProvider.get('/', (req, res) => {

    try{
            
        const payload = {userId : uuidv4()}

        const token = jwt.sign(payload , 'secret_key' , {expiresIn : '30d'})

        return res.status(200).json({token : token})

    }catch(err){
        return res.status(500).json('internal error')
    }
    
});

module.exports = cookiesProvider;
