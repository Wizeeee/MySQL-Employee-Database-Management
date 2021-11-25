// Dependencies - dotenv to hide credentials and mysql2 to create connection

require("dotenv").config();

const mysql = require("mysql2");

// Store variable for ease of use
const secure = process.env;

// Connect to database
const db = mysql.createConnection(
  {
    host: secure.DB_HOST,
    // Your MySQL username,
    user: secure.DB_USER,
    // Your MySQL password
    password: secure.DB_PASS,
    // reference database you want to use
    database: "employees",
  },
  console.log("Employee database connected"),
  console.log(
    "-----------------------------------------------------------------------------------------------------"
  ),
  console.log("WELCOME TO:"),
  console.log(`    
     ,---------------------------------------------------------------------------.
     |                                                                           |
     |     __  __         _____    ____    __                                    |
     |    |  '/  |_   _  / ___,| /  __  | |  |                                   | 
     |    | |'/| | | | || |___,  | |  | | |  |                                   |
     |    | |  | | |_| | ___,  | | |_ | | |  |__                                 |
     |    |_|  |_|,__, ||______| |___,  | |_____|                                |
     |           |_____/             '._'.                                       |
     |     _____                 _                                               |                          
     |    | ____|_ ___ ___ _ __ | |_____ _   _  ___  ___                         |
     |    |  _| | '_  '_  | '_ '| |  _  | | | |/ _ |/ _ |                        |
     |    | |___| | | | | | | ) | | (_) | |_| |  __/  __/                        |
     |    |_____|_| |_| |_| .__/|_|_____|,__, |____|____|                        |
     |                    |_|           |_____/                                  |
     |     __  __                                                       __       |
     |    |  '/  | __ _ _ ___  __ _  __ _  ___  _ ___ ___  ___  _ ___ _|  |_     |
     |    | |'/| |/ _' | '_  |/ _' |/ _' |/ _ || '_  '_  |/ _ || '_  |_    _|    |
     |    | |  | | (_| | | | | (_| | (_| |  __/| | | | | |  __/| | | | |  |      |
     |    |_|  |_|,__,_|_| |_|,__,_|,__, |____||_| |_| |_|____||_| |_| |__|      |
     |                             |_____/                                       |
     |                                                                           |
     '---------------------------------------------------------------------------'`)
);

//export db to complete connection in app.js
module.exports = db;
