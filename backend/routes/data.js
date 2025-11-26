const express = require('express');//importing express
const dataRoute = express.Router();//creating route

const path = require('path'); //importing path from expres

const tickets = require('../data/tikets.json');//importing ticket json file

const verifyToken = require('../config/verifyToken');//importing token validation middleware

dataRoute.use('/audio', express.static(path.join(__dirname, '../data/audio')));//creating route for audio folder
dataRoute.use('/tickets' , express.static(path.join(__dirname, '../data/tickets'))); //creating route for ticket images folder

dataRoute.get('/',verifyToken ,async (req,res) => {
    try {
        const data = tickets.map(ticket => ({
        ...ticket,
        QuestionAudio: `http://localhost:8080/data/audio/${ticket.QuestionAudio}`,
        DescriptionAudio: `http://localhost:8080/data/audio/${ticket.DescriptionAudio}`,
        Image : `http://localhost:8080/data/tickets/${ticket.Image}`
    })); //getting all data from ticket.json and audio folders urls

    return res.status(200).json(data);//returning data to frontend

    }catch(err){
        return res.status(500).json('internal error');//returnning 500 status code if internal error occurs
    };
});//api is used to get all ticket data from backend folder to frontend when user once navigates on /exam route

module.exports = dataRoute;///exporting route