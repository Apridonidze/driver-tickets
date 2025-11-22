const jwt = require('jsonwebtoken')

async function  verifyToken (req,res,next) {
    

    const authHeaders = req.headers['authorization']

    if(!authHeaders){ return res.status(400).json('No Headers Provided') }

            
    const userToken = authHeaders.split(' ')[1]
        
    try{

        
        const token = jwt.verify(userToken, 'secret_key')

        req.user = token.userId

        next()


    }catch(err){
        return res.status(401).json('invalid token')
    }

}


module.exports = verifyToken