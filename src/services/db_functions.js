var db_connexion = require("./db_connexion");
var helper = require("../helper");

function getfulltable(tableName) {
    try {
        db_connexion.queryCallback("SELECT * FROM ".concat(tableName), helper.printCallback);
    }
    catch(err) {
        console.error(err);
    }
}

function seeTables() {
    try {
        db_connexion.queryCallback("SHOW TABLES;", helper.printCallback)
    }
    catch(err) {
        console.error(err);
    }
}

function createUser(values) {
    try {
        db_connexion.queryValues("INSERT INTO utilisateur (nom, prenom, courriel) VALUES (?, ?, ?)", values);
    }
    catch(err) {
        console.error(err);
    }
}

module.exports = {
    getfulltable,
    seeTables,
    createUser
}
