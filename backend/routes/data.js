const express = require('express')
const dataRoute = express.Router()
const path = require('path');

const tickets = require('../data/tikets.json')


dataRoute.use(express.static(path.join(__dirname , 'data' , 'audio')));
dataRoute.use('/audio', express.static(path.join(__dirname, '../data/audio')));
dataRoute.use('/tickets' , express.static(path.join(__dirname, '../data/tickets')))

dataRoute.get('/', async (req,res) => {
    try {

        const data = tickets.map(ticket => ({
        ...ticket,
        QuestionAudio: `http://localhost:8080/data/audio/${ticket.QuestionAudio}`,
        DescriptionAudio: `http://localhost:8080/data/audio/${ticket.DescriptionAudio}`,
        Image : `http://localhost:8080/data/tickets/${ticket.Image}`
    }));

    return res.status(200).json(data);
        

    }catch(err){
        return res.status(500).json('internal error')
    }
})


module.exports = dataRoute