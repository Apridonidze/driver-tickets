const express = require('express');//importing express
const dataRoute = express.Router();//creating route

const path = require('path'); //importing path from expres

const tickets = require('../data/tikets.json');//importing ticket json file


dataRoute.use('/audio', express.static(path.join(__dirname, '../data/audio')));//creating route for audio folder
dataRoute.use('/tickets' , express.static(path.join(__dirname, '../data/tickets'))); //creating route for ticket images folder


dataRoute.get('/', async (req, res) => {

    const host = req.headers.host; // dynamic host
    const protocol = req.protocol; //protocol (http)

  try {
    const data = tickets.map(ticket => ({
        ...ticket,
        QuestionAudio: `${protocol}://${host}/data/audio/${ticket.QuestionAudio}`,
        DescriptionAudio: `${protocol}://${host}/data/audio/${ticket.DescriptionAudio}`,
        Image: `${protocol}://${host}/data/tickets/${ticket.Image}`
    }));//maps tickets and gets ticket audio image and descriptioon audio
    
    return res.status(200).json(data);//returns response to frotned

  } catch (err) {
    return res.status(500).json('internal error');//returns 500 status code if inernal error occurs
  }
});//api is used to get all ticket data from backend folder to frontend when user once navigates on /exam route

module.exports = dataRoute;///exporting route