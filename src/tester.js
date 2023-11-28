const db_functions = require('./services/db_functions');

var db_con = new db_functions.DatabaseFunctions();

//db_functions_1.createBadges([['testbadge1', 'desc1'], ['testbadge2', 'desc2']]);
//db_functions_1.deleteBadge(2);
db_con.addPoints(10, 1);
db_con.getfulltable('utilisateur');

db_con.closeConnection();

