const express = require('express'); //importing express
const savedRoute = express.Router(); //creating route

const db = require('../db/db');//importing db middleware
const verifyToken = require('../config/verifyToken');//importing token validation middleware

const path = require('path');//importing path from express

const tickets = require('../data/tikets.json'); //importing tickets data folder

savedRoute.use('/audio', express.static(path.join(__dirname, '../data/audio')));//defining urls for audio file
savedRoute.use('/tickets' , express.static(path.join(__dirname, '../data/tickets'))); //defining url for ticket images 


savedRoute.get('/saved-tickets', verifyToken , async (req,res) => {//api first runs verifyToken middleware, and if middelware vaidates user token then api is executes 

    try{

        const [ savedTickets ] = await db.query('select ticket_id from savedtickets where user_id = ?' , [req.user]); //fetches saved ticket list and stores in variable

        if(savedTickets.length === 0) return res.status(200).json([]);//if there is no any saved ticket api returns empty arrray
        
        const savedTicketsIds = await savedTickets.map(ids => ids.ticket_id); //else if user has saved ticket , then api gets ids of tickets with map

        const data = tickets.map(ticket => ({
        ...ticket,
        QuestionAudio: `http://localhost:8080/data/audio/${ticket.QuestionAudio}`,
        DescriptionAudio: `http://localhost:8080/data/audio/${ticket.DescriptionAudio}`,
        Image : `http://localhost:8080/data/tickets/${ticket.Image}`})).filter(dt => savedTicketsIds.includes(dt.Id)); //then data is defined by filtering all tickets data and variable only stores data whichs id === user saved ticket ids

        return res.status(200).json(data);//api then retusn 200 status code to server with filtered data

    }catch(err){
        return res.status(500).json('internal error');//returns 500 status code error if internal error occurs
    };
});//api is used to get user saved tickets with all data that is needed for ticket to be displayed


savedRoute.get('/saved-tickets/:ticketId', verifyToken , async (req,res) => {//api first runs verifyToken middleware, and if middelware vaidates user token then api is executes 

    const data = {ticketId : req.params.ticketId , userId : req.user}; //defining ticketId from params  and userId from verifyToken middleware

    try{

        const [ savedTickets ] = await db.query('select * from savedtickets where user_id = ? and ticket_id = ?' , [data.userId , data.ticketId]); //fetcing user ticket form db based on userID and ticket id and storing in variable

        if(savedTickets.length === 0) return res.status(200).json(false);//returns false to frotnend if no saved tickets are found in db
        
        return res.status(200).json(true); //else if saved tickets are found in db api returns 200 status code with true response

    }catch(err){
        return res.status(500).json('internal error');//returns 500 status code to frotnend if internal error occurs
    };
});//api if used to returns true/false based on if user has already answered this ticket 


savedRoute.post('/post-saved-tickets', verifyToken , async (req,res) => {//api first runs verifyToken middleware, and if middelware vaidates user token then api is executes 
    
    const data = {ticketId : req.body.data , userId : req.user}; //definig ticketId from request body and userId from verifyToken middleware

    try{

        await db.query('insert into savedtickets (user_id , ticket_id) values (?,?)' , [ data.userId , data.ticketId ]);//inserting saved ticket into database based on userId and ticketid

        return res.status(200).json('saved successfully');//returns 200 status code if insertion executes succesffulyy

    }catch(err){
        return res.status(500).json('internal error');//returnrs 500 status code if internal error occurs
    };
});//api is used for to insert saved ticket to database, when user click save button on frontend


savedRoute.delete('/delete-saved-tickets/:ticketId' , verifyToken , async (req,res) => {//api first runs verifyToken middleware, and if middelware vaidates user token then api is executes 
     
    try{
        
        const data = {ticketId : req.params.ticketId, userId : req.user}; //defining itcketId from request params and userId from verifyToken middleware

        await db.query('delete from savedtickets where user_id = ? and  ticket_id = ?' , [data.userId , data.ticketId]); //sending delete query to database with values of userId and ticketId

        return res.status(200).json('Unsaved');//returning 200 status code to frotnend if unsave event executes successfully

    }catch(err){
        return res.status(500).json('internal error');//returns 500 status code if internal error occurs
    };
});//api is used to remove saved ticket from database, when user clicks on unsave ticket in frontend


module.exports = savedRoute;//exporting route