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

    getfulltableWithCallback(tableName, callback) {
        try {
            db_connexion.queryCallback("SELECT * FROM ".concat(tableName), callback);
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
    
    addPR(prId, url, description, titre, date_creation, date_merge, date_last_update, status, labels) {
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
            const query = `UPDATE pull_request SET ${field} = '${value}', date_last_update = '${date}' WHERE id_pull_request = ${prId}`;
            console.log("query", query)
            return db_connexion.query(query);
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

    editPRFieldWithPromise(prId, field, value) {
        return new Promise((resolve, reject) => {
          try {
            const query = `UPDATE pull_request SET ${field} = ? WHERE id_pull_request = ?`;
            const values = [value, prId];
            
            db_connexion.queryValuesPromise(query, values)
              .then(result => {
                resolve(result); // Resolve the Promise with the query result
              })
              .catch(error => {
                reject(error); // Reject the Promise with the error
              });
          } catch (err) {
            console.error(err);
            reject(err); // Reject the Promise if an exception occurs
          }
        });
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

    fetchPrWithPromise(prId) {
        return new Promise((resolve, reject) => {
          try {
            db_connexion.queryValuesPromise(`SELECT * FROM pull_request WHERE id_pull_request = ?`, prId)
              .then(result => {
                resolve(result); // Resolve the Promise with the query result
              })
              .catch(error => {
                reject(error); // Reject the Promise if there's an error executing the query
              });
          } catch (err) {
            console.error(err);
            reject(err); // Reject the Promise if an exception occurs
          }
        });
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

    addUser(id_utilisateur, username, points) {
        let values = [id_utilisateur, username, points];
        try {
            db_connexion.queryValues(`INSERT INTO utilisateur (id_utilisateur, username points) VALUES (?, ?, ?)`, values);
        }
        catch(err) {
            console.error(err);
        }
    }

    addUserIfNullWithCallback(id_utilisateur, username, points, callback) {
        try {
            db_connexion.queryCallback(`
                INSERT IGNORE INTO utilisateur (id_utilisateur, username, points) VALUES ('${id_utilisateur}', '${username}', '${points}')`, callback);
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
    
    fetchUser(username) {
        try {
            db_connexion.queryValuesCallback(`SELECT * FROM utilisateur WHERE username = ?`, username, helper.printCallback);
        }
        catch(err) {
            console.error(err);
        }
    }

    fetchUserWithCallback(username, callback) {
        try {
            db_connexion.queryValuesCallback(`SELECT * FROM utilisateur WHERE username = ?`, username, callback);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    fetchBadge(action){
        try {
            db_connexion.query(`SELECT * FROM badge WHERE action = '${action}'`);
        }
        catch(err) {
            console.error(err);
        }
    }

    fetchBadgeWithCallback(action, callback){
        try {
            db_connexion.queryCallback(`SELECT * FROM badge WHERE action = '${action}'`, callback);
        }
        catch(err) {
            console.error(err);
        }
    }

    createBadges(titre, description, action) {
        try {
            db_connexion.query(`INSERT INTO badge (titre, description, action) VALUES ('${titre}', '${description}', '${action}')`);
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
    
    createPaliers(points_attrib, titre_palier, nb_action_requise, image, tier) {
        try {
            db_connexion.queryValues(`INSERT INTO palier (points_attrib, titre_palier, nb_action_requise, image, tier) 
            VALUES (${points_attrib}, '${titre_palier}', ${nb_action_requise}, '${image}', '${tier}');`);
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

    getPalierWithCallback(titre, callback) {
        try {
            console.log("titre", titre)
            db_connexion.queryCallback(`SELECT * FROM palier WHERE titre_palier = '${titre}'`, callback);
        }
        catch(err) {
            console.error(err);
        }
    }

    fetchPalierWithCallback(id_palier, callback) {
        try {
            db_connexion.queryCallback(`SELECT * FROM palier WHERE id_palier = '${id_palier}'`, callback);
        }
        catch(err) {
            console.error(err);
        }
    }

    addUserBadge(id_user, id_badge, progression, palier) {
        try {
            db_connexion.queryValues(`INSERT INTO utilisateur_badge (id_utilisateur, id_badge, progression, numero_palier) 
            VALUES ('${id_user}', '${id_badge}', '${progression}', '${palier}')`);
        }
        catch(err) {
            console.error(err);
        }
    }

    addBadgePaliers(id_badge, id_palier) {
        try{
            db_connexion.queryValues(`INSERT INTO badge_palier (id_badge, id_palier) VALUES ('${id_badge}', '${id_palier}')`);
        }
        catch(err) {
            console.error(err);
        }
    }

    fetchBadgePalierWithCallback(id_badge, callback) {
        try{
            db_connexion.queryCallback(`SELECT * FROM badge_palier WHERE id_badge = '${id_badge}'`, callback);
        }
        catch(err) {
            console.error(err);
        }
    }

    addPullRequestUser(userId, prId, role) {
        console.log("values", userId, prId, role)
        try{
            db_connexion.queryValues(`INSERT INTO utilisateur_pr (id_utilisateur, id_pull_request, role) VALUES ('${userId}', '${prId}', '${role}')`);
        }
        catch(err) {
            console.error(err);
        }
    }

    removePullRequestUser(userId, prId, role) {
        console.log("values", userId, prId, role)
        try{
            db_connexion.queryValues(`DELETE FROM utilisateur_pr WHERE id_utilisateur = '${userId}' AND id_pull_request = '${prId}' AND role = '${role}';`);
        }
        catch(err) {
            console.error(err);
        }
    }

    fetchPullRequestUserWithCallback(id_pull_request, id_utilisateur, callback){
        try{
            db_connexion.queryCallback(`SELECT * FROM utilisateur_pr WHERE id_utilisateur = '${id_utilisateur}' AND id_pull_request = '${id_pull_request}'`, callback);
        }
        catch(err) {
            console.error(err);
        }
    }

    addPoints(id_utilisateur, numPoints) {
        try{
            return db_connexion.query(`UPDATE utilisateur SET points = points + '${numPoints}' WHERE id_utilisateur = '${id_utilisateur}'`);
        }
        catch(err) {
            console.error(err);
        }
    }

    addPointsWithCallback(id_utilisateur, numPoints, callback) {
        try{
            db_connexion.queryCallback(`UPDATE utilisateur SET points = points + '${numPoints}' WHERE id_utilisateur = '${id_utilisateur}'`, callback);
        }
        catch(err) {
            console.error(err);
        }
    }

    removePoints(numPoints, username) {
        let values = [numPoints, username];
        try{
            return db_connexion.queryValues(`UPDATE utilisateur SET points = points - ? WHERE username = ?`, values);
        }
        catch(err) {
            console.error(err);
        }
    }

    removePointsWithCallback(numPoints, username, callback) {
        let values = [numPoints, username];
        try{
            db_connexion.queryValuesCallback(`UPDATE utilisateur SET points = points - ? WHERE username = ?`, values, callback);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    fetchUserBadgeWithCallback(id_utilisateur, id_badge, callback){
        try{
            return db_connexion.queryCallback(`SELECT * FROM utilisateur_badge WHERE id_utilisateur = ${id_utilisateur} AND id_badge = ${id_badge}`, callback);
        }
        catch(err) {
            console.error(err);
        }
    } 

    updateProgressionWithCallback(id_utilisateur, id_badge, increment, callback) {
        console.log("query", id_utilisateur, id_badge, increment)
        try{
            return db_connexion.queryCallback(`UPDATE utilisateur_badge SET progression = progression + ${increment} WHERE id_utilisateur = ${id_utilisateur} AND id_badge = ${id_badge}`, callback);
        }
        catch(err) {
            console.error(err);
        }
    }

    updateTier(id_utilisateur, id_badge, tier) {
        try{
            return db_connexion.query(`UPDATE utilisateur_badge SET numero_palier = ${tier} WHERE id_utilisateur = ${id_utilisateur} AND id_badge = ${id_badge}`);
        }
        catch(err) {
            console.error(err);
        }
    }
}

module.exports = { DatabaseFunctions: DatabaseFunctions }
