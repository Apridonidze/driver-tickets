require('dotenv').config();//importing dotenv

const CorsOptions = {
    origin : process.env.PORT, 
    credentials : true,
    allowHeaders : ['Content-Type', 'Authorization'],
    methods : ['GET' , 'POST' , 'Delete']
}; //defining cors options for server.js

module.exports = CorsOptions; //exporting middleware