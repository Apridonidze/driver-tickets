const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173' , process.env.ORIGIN_URL]; //array of possible origin (frontend) urls


const CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }},//if origin url exists then server returns true to console, else it throws Not Allowed by Cors error
  credentials: true //allowing credentials
};


module.exports = CorsOptions;//exporting route