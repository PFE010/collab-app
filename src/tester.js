var db_functions_1 = require("./services/db_functions");
var db_con = require("./services/db_connexion");

db_con.connect();

db_functions_1.seeTables();
db_functions_1.seeTables();

db_con.endConnection();

