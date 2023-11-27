var db_functions_1 = require("./services/db_functions");
var db_con = require("./services/db_connexion");

db_con.connect();

//db_functions_1.createBadges([['testbadge1', 'desc1'], ['testbadge2', 'desc2']]);
//db_functions_1.deleteBadge(2);
db_functions_1.getfulltable('badge');

db_con.endConnection();

