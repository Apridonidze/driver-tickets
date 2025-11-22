const mysql = require('mysql2/promise')

mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '$fc59A636a27CBo5=sZ27o=Mc]WG76B',
    database : 'driver_tickets_db', //move to .env
})