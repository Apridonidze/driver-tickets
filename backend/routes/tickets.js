const express = require('express');//importing express
const ticketRoute = express.Router(); //creating route

const verifyToken = require('../config/verifyToken');//importing token verify middleware

const db = require('../db/db');//importing db query

ticketRoute.get('/', (req,res) => {
    res.send('Tickets Route')
})

ticketRoute.get('/answered-tickets' , verifyToken , async (req,res) => { //api first runs veriftToken middleware, if it successs then answered-tickets api executes
    
    try{

        const userId = req.user; //getting userId from verifyToken

        const [ answeredTickets ] = await db.query('select ticketId, answerId, correctId from answeredtickets where user_id = ?',[userId]); //getting tickets from database bt userId

        if(answeredTickets.length === 0) return res.status(200).json([]); //if user has not answered any tickets then api returns empty array to frontned

        return res.status(200).json(answeredTickets);//else if user has answered tickets , api returns array of answered tickets
        
    }catch(err){
        return res.status(500).json(err); //returns 500 status code if internal error occurs in api
    };
});//api is used to get user answered tickets from database and send suitable response to frontend , with its errorr handling


ticketRoute.post('/post-answered-tickets' , verifyToken, async (req,res) => {//api first runs veriftToken middleware, if it successs then answered-tickets api executes
    
    try{
        
        let data = {userId : req.user , answeredTicket : req.body.answeredTicketLast}; //defining data with userId from verifyToken , and lastAnsweredTciekt from statements body

        const [ isAlreadyInserted ] = await db.query('select * from answeredtickets where ticketId = ? and user_id = ?' , [data.answeredTicket.ticketId , data.userId]); //fetcing answered tickets list from database 

        if(isAlreadyInserted.length > 0) return res.status(400).json('Ticket Already Inserted');//checks if user already answered to this ticket and returns 400 status code error

        await db.query('insert into answeredTickets (user_id, ticketId, answerId, correctId) values ( ? , ? , ? , ? )' , [data.userId ,data.answeredTicket.ticketId , data.answeredTicket.answerId , data.answeredTicket.correctId]); //else api inserts into database 
        
        return res.status(200).json(`ticket inserted successfully`); //and returns 200 status code to frotnend

    }catch(err){
        return res.status(500).json(err);//returns 500 status code to frontend if internal error occurs
    };
});//api is used to insert tickets that user answered into database, then api sends suitable response to frotnend 

ticketRoute.delete('/delete-answered-tickets' , verifyToken , async(req,res) => {//api first runs veriftToken middleware, if it successs then answered-tickets api executes

    const userId = req.user; //defining userID from verifyToken middleware

    try{

        await db.query('delete from answeredTickets where user_id = ?' , [userId]); //sening delete query to database

        return res.status(200).json('Ticket Deleted');//returns 200 status code if query successfully executyes

    }catch(err){
        return res.status(500).json(err); //returns 500 status code if internal error occurs
    };
});//api is used for reseting all of the progress that user had by clicking reset button , then api returns response to frotnend


module.exports = ticketRoute; //exporting route