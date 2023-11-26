var db_connexion = require("./db_connexion");


class DatabaseFunctions {
    getfulltable(tableName) {
        return (0, db_connexion.default)("SELECT * FROM ".concat(tableName));
    }
    
    seeTables() {
        return db_connexion.query("SHOW TABLES;")
    }

    create_pr(url, description, titre, date_creation, date_merge, date_last_update, status, labels) {
        var query_string = `INSERT INTO pull_request (ID_PULL_REQUEST, URL, DESCRIPTION, TITRE, DATE_CREATION, DATE_MERGE, DATE_LAST_UPDATE, STATUS, LABELS) VALUES (${url}, ${description}, ${titre}, ${date_creation}, ${date_merge}, ${date_last_update}, ${status}, ${labels});`

        console.log(query_string)
        return db_connexion.query(`INSERT INTO pull_request (URL, DESCRIPTION, TITRE, DATE_CREATION, DATE_MERGE, DATE_LAST_UPDATE, STATUS, LABELS)
        VALUES (
            ${url},
            ${description},
            ${titre},
            ${date_creation},
            ${date_merge},
            ${date_last_update},
            ${status},
            ${labels}
        );
        `)
    }

    fetch_pr() {

    }

    fetch_all_pr() {
        return db_connexion.query("SELECT * FROM pull_request")
    }
}

module.exports = { DatabaseFunctions: DatabaseFunctions }