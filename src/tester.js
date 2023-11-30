const db_functions = require('./services/db_functions');

var db_con = new db_functions.DatabaseFunctions();
db_con.openConnection();

//TEST HERE
db_con.getfulltable('pull_request');

db_con.closeConnection();

