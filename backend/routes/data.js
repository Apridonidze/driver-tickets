const express = require('express');//importing express
const dataRoute = express.Router();//creating route

const tickets = require('../data/tikets.json');//importing ticket json file


dataRoute.get('/', async (req, res) => {

    try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = 100;

    const mappedTickets = tickets.map(ticket => ({
      ...ticket,
      QuestionAudio: `${process.env.BACKEND_URL}/audio/${ticket.QuestionAudio}`,
      DescriptionAudio: `${process.env.BACKEND_URL}/audio/${ticket.DescriptionAudio}`,
      Image: `${process.env.BACKEND_URL}/ticket/${ticket.Image}`
    }));

    const chunk = mappedTickets.slice(offset, offset + limit);

    return res.status(200).json({data: chunk});

  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}); //requires


module.exports = dataRoute;///exporting route