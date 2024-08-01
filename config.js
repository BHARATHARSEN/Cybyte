import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
    database: "",

});

connection.connect((err) => {
    if(err) throw err;
    console.log("Connected to the MySQL server.");
});

export default connection ;