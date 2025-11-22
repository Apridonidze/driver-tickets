const express = require('express')
const cookiesProvider = express.Router()

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");
const db = require('../db/db')

cookiesProvider.get('/', async (req, res) => {

    try{

        
        const payload = {userId : uuidv4()}

        const token = jwt.sign(payload , 'secret_key' , {expiresIn : '30d'})


        await db.query('insert into users (user_id) values (?)', [payload.userId])

        return res.status(200).json({token : token})

    }catch(err){
        return res.status(500).json('internal error')
    }
    
});

module.exports = cookiesProvider;
