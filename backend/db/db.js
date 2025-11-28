const mysql = require('mysql2/promise'); //importing mysql promise

require('dotenv').config(); //importing dotenv

const db = mysql.createPool({ //creating pool connection to db
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DB,
}); //definig db pool dependencies from .env so we can use this pool for any sql satatement in apis needed easily


module.exports = db; //exporting middleware