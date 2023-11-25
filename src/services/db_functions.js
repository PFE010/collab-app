var db_connexion = require("./db_connexion");

function getfulltable(tableName) {
    return (0, db_connexion.default)("SELECT * FROM ".concat(tableName));
}

function seeTables() {
    db_connexion.query("SHOW TABLES;", (result) => {return result})
}

function createUser() {

}

module.exports = {
    getfulltable,
    seeTables
}
