var db_connexion = require("./db_connexion");
var helper = require("../helper");


class DatabaseFunctions {
    constructor() {
        db_connexion.connect();
    }
    
    closeConnection() {
        db_connexion.endConnection();
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
    
    createPR(url, description, date_creation, date_merge, date_last_update, status, labels) {
        let values = [url, description, date_creation, date_merge, date_last_update, status, labels];
        try {
            db_connexion.queryValues(`INSERT INTO pull_request (url, description, titre, date_creation, date_merge, date_last_update, status, labels) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, values);
        }
        catch(err) {
            console.error(err);
        }
    }

    edit_pr(prId, url, description, titre, date_creation, date_merge, date_last_update, status, labels) {
        let values = [url, description, titre, date_creation, date_merge, date_last_update, status, labels, prId];
        try{
            return db_connexion.queryValues(`UPDATE pull_request SET url = ?, description = ?, titre = ?, date_creation = ?, date_merge = ?, date_last_update = ?, status = ?, labels = ? WHERE id_pull_request = ?`, values);
        }
        catch(err) {
            console.error(err);
        }
    }

    fetchPr(prId) {
        try {
            db_connexion.queryValuesCallback(`SELECT * FROM pull_request WHERE id_pull_request = ?`, prId, helper.printCallback);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    createUser(nom, prenom, courriel, points) {
        let values = [nom, prenom, courriel, points];
        try {
            db_connexion.queryValues(`INSERT INTO utilisateur (nom, prenom, courriel, points) VALUES (?, ?, ?, ?)`, values);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    deleteUser(userId) {
        try {
            db_connexion.queryValues(`DELETE FROM utilisateur WHERE id_utilisateur = ?`, userId);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    //update user with values [nom, prenom, courriel, id_utilisateur]
    updateUser(newNom, newPrenom, newCourriel, userId) {
        let values = [newNom, newPrenom, newCourriel, userId];
        try {
            db_connexion.queryValues(`UPDATE utilisateur SET nom = ?, prenom = ?, courriel = ? WHERE id_utilisateur = ?`, values);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    fetchUser(userId) {
        try {
            db_connexion.queryValuesCallback(`SELECT * FROM utilisateur WHERE id_utilisateur = ?`, userId, helper.printCallback);
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
            db_connexion.queryValues(`DELETE FROM badge WHERE id_badge = ?`, badgeId);
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
            db_connexion.queryValues(`DELETE FROM palier WHERE id_palier = ?`, palierId);
        }
        catch(err) {
            console.error(err);
        }
    }

    addBadgePaliers(values) {
        try{
            db_connexion.queryValues(`INSERT INTO badge_palier (id_badge, id_palier) VALUES ?`, [values]);
        }
        catch(err) {
            console.error(err);
        }
    }

    addPullRequestUser(role, userId, prId) {
        let values = [role, userId, prId];
        try{
            db_connexion.queryValues(`INSERT INTO utilisateur_pull_request (role, id_utilisateur, id_pull_request) VALUES (?)`, [values]);
        }
        catch(err) {
            console.error(err);
        }
    }

    addUserBadge(userId, badgeId, progression, numero_palier) {
        let values = [userId, badgeId, progression, numero_palier];
        try{
            db_connexion.queryValues(`INSERT INTO utilisateur_badge (id_utilisateur, id_badge, progression, numero_palier) VALUES (?)`, [values]);
        }
        catch(err) {
            console.error(err);
        }
    }

    addPoints(numPoints, userId) {
        let values = [numPoints, userId];
        try{
            db_connexion.queryValues(`UPDATE utilisateur SET points = points + ? WHERE id_utilisateur = ?`, values);
        }
        catch(err) {
            console.error(err);
        }
    }

    removePoints(numPoints, userId) {
        let values = [numPoints, userId];
        try{
            db_connexion.queryValues(`UPDATE utilisateur SET points = points - ? WHERE id_utilisateur = ?`, values);
        }
        catch(err) {
            console.error(err);
        }
    }
}

module.exports = { DatabaseFunctions: DatabaseFunctions }