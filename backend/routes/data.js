const express = require('express');//importing express
const dataRoute = express.Router();//creating route

const tickets = require('../data/tikets.json');//importing ticket json file


dataRoute.get('/', async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;//number from where data should be fetched fromn
    const limit = 100; //limit of data in one response

    const mappedTickets = tickets.map(ticket => ({
      ...ticket,
      QuestionAudio: `${process.env.BACKEND_URL}/audio/${ticket.QuestionAudio}`,
      DescriptionAudio: `${process.env.BACKEND_URL}/audio/${ticket.DescriptionAudio}`,
      Image: `${process.env.BACKEND_URL}/ticket/${ticket.Image}`
    })); //generates all data from ticket.json file and assigns audio files to it for frontend

    const chunk = mappedTickets.slice(offset, offset + limit); //defines sliced data from offset to offset + 100 , for frontned

    return res.status(200).json({data: chunk});//sends data to frontend

  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' }); //returns internal error message to frontend
  }
}); //gets offset as a query from frontend , generates aall tickets on first run and assigns audio files to data, then data is sent by chucks for better performance


module.exports = dataRoute;///exporting route