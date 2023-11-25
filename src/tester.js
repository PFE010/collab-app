var db_functions_1 = require("./services/db_functions");
var db_con = require("./services/db_connexion");

db_con.connect();

db_functions_1.createUser(['leo', 'lapointe', 'leo-paul.lapointe.1@ens.etsmtl.ca']);
db_functions_1.getfulltable("utilisateur");

db_con.endConnection();

