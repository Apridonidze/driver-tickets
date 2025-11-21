const express = require('express')
const dataRoute = express.Router()
const path = require('path');

const tickets = require('../data/tikets.json')


const audioPath = path.join(__dirname , 'data' , 'audio'); // Adjust as needed

dataRoute.use(express.static(audioPath));


dataRoute.use('/audio', express.static(path.join(__dirname, '../data/audio')));
dataRoute.use('/tickets' , express.static(path.join(__dirname, '../data/tickets')))

dataRoute.get('/', async (req,res) => {
    try {

        const data = tickets.map(t => ({
        ...t,
        QuestionAudio: `http://localhost:8080/data/audio/${t.QuestionAudio}`,
        DescriptionAudio: `http://localhost:8080/data/audio/${t.DescriptionAudio}`,
        Image : `http://localhost:8080/data/tickets/${t.Image}`
    }));

    return res.status(200).json(data);
        

    }catch(err){
        return res.status(500).json('internal error')
    }
})


module.exports = dataRoute