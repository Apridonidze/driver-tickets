const jwt = require('jsonwebtoken')

function verifyToken (req,res,next) {
    const authHeaders = req.headers

    if(authHeaders && authHeaders.authorization){
        
        const auth = authHeaders.authorization.split(' ')[1]

        if(auth){

            const token = jwt.verify(auth , 'secret_key')

            req.user = token.userId


        }


        next()
    }else {
        
    }
}


module.exports = verifyToken