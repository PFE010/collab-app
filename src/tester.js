const db_functions = require('./services/db_functions');

var db_con = new db_functions.DatabaseFunctions();

//TEST HERE
//db_con.addUserBadge(1, 3, 0, 1);
db_con.createPR(6, null, null, 'nullPr', '1999-08-19', null, null, null, null)
db_con.getfulltable('pull_request');

db_con.closeConnection();

