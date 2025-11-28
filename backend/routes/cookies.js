const express = require('express'); //importing epxress
const cookiesProvider = express.Router(); //creating route

const jwt = require('jsonwebtoken');//importing jwt library
const { v4: uuidv4 } = require("uuid");//importing uuidv4 to generate random tokens for user

const db = require('../db/db');//importing db middleware

require('dotenv').config(); //importing dotenv

cookiesProvider.get('/', async (req, res) => {

    try{

        const payload = {userId : uuidv4()};//creawting payload with random token

        const token = jwt.sign(payload , process.env.JWT_SECRET_KEY , {expiresIn : '30d'});//signing token with random token payload and with 30 days exparation


        await db.query('insert into users (user_id) values (?)', [payload.userId]);//inserting user id to database

        return res.status(200).json({token : token});//returning token to frontend where frontned stores token as cookie.token for each user

    }catch(err){
        return res.status(500).json(err);//returns 500 status code if internal error occurs
    };
    
});//api is used to generate random token to each user , so now saving answered ticket, saving tickets becomes possible for each user with token

module.exports = cookiesProvider;//exporting route