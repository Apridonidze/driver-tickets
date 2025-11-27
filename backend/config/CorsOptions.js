
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173' , process.env.ORIGIN_URL];


const CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
}


module.exports = CorsOptions