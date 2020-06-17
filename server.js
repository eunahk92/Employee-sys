const inquirer = require("inquirer");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();
const { DB_HOST, PORT, DB_USER, DB_PASSWORD } = process.env;

const connection = mysql.createConnection({
    host: DB_HOST,
    port: PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "ex_company_db"
});
  
connection.connect(err => {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});