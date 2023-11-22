var db_connexion = require("./db_connexion");

function getfulltable(tableName) {
    return (0, db_connexion.default)("SELECT * FROM ".concat(tableName));
}

function seeTables() {
    return db_connexion.query("SHOW TABLES;")
}

module.exports = {
    getfulltable,
    seeTables
}
