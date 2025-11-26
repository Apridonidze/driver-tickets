const jwt = require('jsonwebtoken') ; //importing express libraries
require('dotenv').config();

async function verifyToken (req,res,next) {

    const authHeader = req.headers['authorization'] ; //gets headers from request

    if(!authHeader || !authHeader.split(' ')) {return res.status(400).json('No Headers Provided')}

    try{
        const userToken = authHeader.split(' ')[1]; // splits headers to get cookies
    
        const token = jwt.verify(userToken, process.env.JWT_SECRET_KEY); //verifies token
        req.user = token.userId; //sets req.user value to veriftToken so we can reuse it 

        next(); //triggers next function after this middleware finishes his logic

    }catch(err){
        return res.status(401).json('Invalid Token')
    }

}; //middleware is used to avoid non-authenticated users from sending request to our server who might be potential attackers. also to secure our backend side from request inejction from untrusted sources

module.exports = verifyToken; //exporting middleware