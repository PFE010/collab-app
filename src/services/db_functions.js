var db_connexion = require("./db_connexion");


class DatabaseFunctions {
    getfulltable(tableName) {
        return (0, db_connexion.default)("SELECT * FROM ".concat(tableName));
    }
    
    seeTables() {
        return db_connexion.query("SHOW TABLES;")
    }

    create_pr(number, url, description, titre, date_creation, date_merge, date_last_update, status, labels) {
        return db_connexion.query(`INSERT INTO pull_request (ID_PULL_REQUEST, URL, DESCRIPTION, TITRE, DATE_CREATION, DATE_MERGE, DATE_LAST_UPDATE, STATUS, LABELS)
         VALUES ('${number}',
         '${url}',
         '${description}',
         '${titre}',
         '${date_creation}',
         '${date_merge}',
         '${date_last_update}',
         '${status}',
         '${labels}')`)
    }

    edit_pr(number,  url, description, titre, date_creation, date_merge, date_last_update, status, labels) {
        return db_connexion.query(`
        UPDATE pull_request 
        SET URL = '${url}',
            DESCRIPTION = '${description}',
            TITRE = '${titre}',
            DATE_CREATION = '${date_creation}',
            DATE_MERGE = '${date_merge}',
            DATE_LAST_UPDATE = '${date_last_update}',
            STATUS = '${status}',
            LABELS = '${labels}'
        WHERE ID_PULL_REQUEST = ${number}`);
    }

    fetch_pr(number) {
        return db_connexion.query(`SELECT * FROM pull_request
        WHERE ID_PULL_REQUEST = ${number}`)
    }

    fetch_all_pr() {
        return db_connexion.query("SELECT * FROM pull_request")
    }
}

module.exports = { DatabaseFunctions: DatabaseFunctions }