require('dotenv').config();//importing dotenv


const allowedOrigins = [
  process.env.ORIGIN_URL,
  "http://localhost:5173",
  "http://localhost:3000"
];

const CorsOptions = {
    origin : function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
    credentials : true,
    allowHeaders : ['Content-Type', 'Authorization'],
    methods : ['GET' , 'POST' , 'DELETE']
}; //defining cors options for server.js

module.exports = CorsOptions; //exporting middleware