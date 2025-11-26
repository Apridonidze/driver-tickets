require('dotenv').config();//importing dotenv

const CorsOptions = {
    origin : process.env.ORIGIN_URL,
    credentials : true,
    allowHeaders : ['Content-Type', 'Authorization'],
    methods : ['GET' , 'POST' , 'DELETE']
}; //defining cors options for server.js

module.exports = CorsOptions; //exporting middleware