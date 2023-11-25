var db_connexion = require("./db_connexion");
var helper = require("../helper");

function getfulltable(tableName) {
    return (0, db_connexion.default)("SELECT * FROM ".concat(tableName));
}

function seeTables() {
    db_connexion.query("SHOW TABLES;", helper.printCallback)
}

function createUser() {

}

module.exports = {
    getfulltable,
    seeTables
}
