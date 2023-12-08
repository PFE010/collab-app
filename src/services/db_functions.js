var db_connexion = require("./db_connexion");
var helper = require("../helper");


class DatabaseFunctions {
    constructor() { }

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
    
    createPR(prId, url, description, titre, date_creation, date_merge, date_last_update, status, labels) {
        let values = [prId, url, description, titre, date_creation, date_merge, date_last_update, status, labels];
        try {
            db_connexion.queryValues(`INSERT INTO pull_request (id_pull_request, url, description, titre, date_creation, date_merge, date_last_update, status, labels) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, values);
        }
        catch(err) {
            console.error(err);
        }
    }

    editPR(prId, url, description, titre, date_creation, date_merge, date_last_update, status, labels) {
        let values = [url, description, titre, date_creation, date_merge, date_last_update, status, labels, prId];
        try{
            return db_connexion.queryValues(`UPDATE pull_request SET url = ?, description = ?, titre = ?, date_creation = ?, date_merge = ?, date_last_update = ?, status = ?, labels = ? WHERE id_pull_request = ?`, values);
        }
        catch(err) {
            console.error(err);
        }
    }

    editPRField(prId, field, value, date) {
        try {
            const query = `UPDATE pull_request SET ? = ?, date_last_update = ? WHERE id_pull_request = ?`;
            const values = [field, value, date, prId];
            return db_connexion.queryValues(query, values);
        } catch (err) {
            console.error(err);
        }
    }

    editPRFieldWithCallback(prId, field, value, callback) {
        try {
            const query = `UPDATE pull_request SET ${field} = ? WHERE id_pull_request = ?`;
            const values = [value, prId];
            return db_connexion.queryValuesCallback(query, values, callback);
        } catch (err) {
            console.error(err);
        }
    }

    fetchPrAndPrint(prId) {
        try {
            return db_connexion.queryValuesCallback(`SELECT * FROM pull_request WHERE id_pull_request = ?`, prId, helper.printCallback);
        }
        catch(err) {
            console.error(err);
        }
    }

    fetchPrWithCallback(prId, callback) {
        try {
            db_connexion.queryValuesCallback(`SELECT * FROM pull_request WHERE id_pull_request = ?`, prId, callback);
        }
        catch(err) {
            console.error(err);
        }
    }
    fetchAllPr(callback) {
        try {
            db_connexion.queryCallback(`SELECT * FROM pull_request`, callback);
        }
        catch(err) {
            console.error(err);
        }
    }

    fetchAllPrTest() {
        try {
            db_connexion.query(`SELECT * FROM pull_request`);
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

    createUserIfNull(nom, prenom, courriel, points) {
        let values = [nom, prenom, courriel, points];
        try {
            db_connexion.queryValues(`
                INSERT IGNORE INTO utilisateur (nom, prenom, courriel, points) VALUES (?, ?, ?, ?)`, values);
        } catch (err) {
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
    
    fetchUser(login) {
        try {
            db_connexion.queryValuesCallback(`SELECT * FROM utilisateur WHERE nom = ?`, login, helper.printCallback);
        }
        catch(err) {
            console.error(err);
        }
    }

    fetchUserWithCallback(login, callback) {
        try {
            db_connexion.queryValuesCallback(`SELECT * FROM utilisateur WHERE nom = ?`, login, callback);
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

    async addPoints(numPoints, login) {
        let values = [numPoints, login];
        try{
            return db_connexion.queryValues(`UPDATE utilisateur SET points = points + ? WHERE nom = ?`, values);
        }
        catch(err) {
            console.error(err);
        }
    }

    addPointsWithCallback(numPoints, login, callback) {
        let values = [numPoints, login];
        try{
            db_connexion.queryValuesCallback(`UPDATE utilisateur SET points = points + ? WHERE nom = ?`, values, callback);
        }
        catch(err) {
            console.error(err);
        }
    }

    async removePoints(numPoints, login) {
        let values = [numPoints, login];
        try{
            return db_connexion.queryValues(`UPDATE utilisateur SET points = points - ? WHERE nom = ?`, values);
        }
        catch(err) {
            console.error(err);
        }
    }

    removePointsWithCallback(numPoints, login, callback) {
        let values = [numPoints, login];
        try{
            db_connexion.queryValuesCallback(`UPDATE utilisateur SET points = points - ? WHERE nom = ?`, values, callback);
        }
        catch(err) {
            console.error(err);
        }
    }
}

module.exports = { DatabaseFunctions: DatabaseFunctions }