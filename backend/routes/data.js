const express = require('express');//importing express
const dataRoute = express.Router();//creating route

const tickets = require('../data/tikets.json');//importing ticket json file


dataRoute.get('/', async (req, res) => {


  try {
    const data = tickets.map(ticket => ({
        ...ticket,
        QuestionAudio: `${process.env.BACKEND_URL}/audio/${ticket.QuestionAudio}`,
        DescriptionAudio: `${process.env.BACKEND_URL}/audio/${ticket.DescriptionAudio}`,
        Image: `${process.env.BACKEND_URL}/ticket/${ticket.Image}`
    }));//maps tickets and gets ticket audio image and descriptioon audio
    
    return res.status(200).json(data);//returns response to frotned

  } catch (err) {
    return res.status(500).json(err);//returns 500 status code if inernal error occurs
  }
});//api is used to get all ticket data from backend folder to frontend when user once navigates on /exam route

module.exports = dataRoute;///exporting route