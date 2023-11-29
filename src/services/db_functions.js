var db_connexion = require("./db_connexion");
var helper = require("../helper");


class DatabaseFunctions {
    constructor() {
        db_connexion.connect();
    }
    
    seeTables() {
        return db_connexion.query("SHOW TABLES;")
    }

    createPR(url, description, date_creation, date_merge, date_last_update, status, labels) {
        let values = [url, description, date_creation, date_merge, date_last_update, status, labels];
        try {
            db_connexion.queryValues("INSERT INTO pull_request (url, description, titre, date_creation, date_merge, date_last_update, status, labels) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", values);
        }
        catch(err) {
            console.error(err);
        }
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

    fetch_all_pr(callback) {
        db_connexion.queryCallback("SELECT * FROM pull_request", callback)
    }

    getfulltable(tableName) {
        try {
            db_connexion.queryCallback("SELECT * FROM ".concat(tableName), helper.printCallback);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    seeTables() {
        try {
            db_connexion.queryCallback("SHOW TABLES;", helper.printCallback)
        }
        catch(err) {
            console.error(err);
        }
    }
    
    createUser(nom, prenom, courriel) {
        let values = [nom, prenom, courriel];
        try {
            db_connexion.queryValues("INSERT INTO utilisateur (nom, prenom, courriel) VALUES (?, ?, ?)", values);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    deleteUser(userId) {
        try {
            db_connexion.queryValues("DELETE FROM utilisateur WHERE id_utilisateur = ?", userId);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    //update user with values [nom, prenom, courriel, id_utilisateur]
    updateUser(newNom, newPrenom, newCourriel, userId) {
        let values = [newNom, newPrenom, newCourriel, userId];
        try {
            db_connexion.queryValues("UPDATE utilisateur SET nom = ?, prenom = ?, courriel = ? WHERE id_utilisateur = ?", values);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    createBadges(values) {
        try {
            db_connexion.queryValues(`INSERT INTO badge (titre, description) VALUES ?`, [values]);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    deleteBadge(badgeId) {
        try {
            db_connexion.queryValues("DELETE FROM badge WHERE id_badge = ?", badgeId);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    createPaliers(values) {
        try {
            db_connexion.queryValues(`INSERT INTO palier (points_attrib, titre_palier, nb_action_requise, image) VALUES ?`, [values]);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    deletePalier(palierId) {
        try {
            db_connexion.queryValues("DELETE FROM palier WHERE id_palier = ?", palierId);
        }
        catch(err) {
            console.error(err);
        }
    }

    closeConnection() {
        db_connexion.endConnection();
    } 
}

module.exports = { DatabaseFunctions: DatabaseFunctions }