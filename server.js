const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql');
const logo = require("asciiart-logo");

const connection = mysql.createConnection({
    //This is your host in MySQL
    
    host: "localhost",

    //This is your Port # in MySQL
    port: 3306,

    //Your username
    user: "root",

    //Your password
    password: "101993Rlf",
    database: "tracker"

});

connection.connect(function(err) {
    if(err) throw err;

    const logoText = logo({ name: "EMPLOYEE TRACKER" }).render()
    console.log(logoText);
})

async function main() {
    // get the client
    const mysql = require('mysql/promise');
};