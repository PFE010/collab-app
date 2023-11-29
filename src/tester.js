const db_functions = require('./services/db_functions');

var db_con = new db_functions.DatabaseFunctions();

//TEST HERE
//db_con.addUserBadge(1, 3, 0, 1);
db_con.getfulltable('utilisateur_badge');

db_con.closeConnection();

