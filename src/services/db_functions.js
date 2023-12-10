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
            db_connexion.queryValues(`INSERT INTO utilisateur (id_utilisateur, username, points) VALUES (?, ?, ?)`, values);
        }
        catch(err) {
            console.error(err);
        }
    }

    addUserIfNull(id_utilisateur, username, points) {
        let values = [id_utilisateur, username, points];
        try {
            db_connexion.queryValues(`
                INSERT IGNORE INTO utilisateur (id_utilisateur, username, points) VALUES (?, ?, ?)`, values);
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
    updateUser(newUsername, userId) {
        let values = [newUsername, userId];
        try {
            db_connexion.queryValues(`UPDATE utilisateur SET username = ? WHERE id_utilisateur = ?`, values);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    fetchUser(login) {
        try {
            db_connexion.queryValuesCallback(`SELECT * FROM utilisateur WHERE username = ?`, login, helper.printCallback);
        }
        catch(err) {
            console.error(err);
        }
    }

    fetchUserWithCallback(login, callback) {
        try {
            db_connexion.queryValuesCallback(`SELECT * FROM utilisateur WHERE username = ?`, login, callback);
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
    
    createPaliers(points_attrib, titre_palier, nb_action_requise, image) {
        try {
            db_connexion.queryValues(`INSERT INTO palier (points_attrib, titre_palier, nb_action_requise, image) 
            VALUES (${points_attrib}, '${titre_palier}', ${nb_action_requise}, '${image}');`);
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

    addPullRequestUser(role, userId, prId) {
        let values = [role, userId, prId];
        try{
            db_connexion.queryValues(`INSERT INTO utilisateur_pull_request (role, id_utilisateur, id_pull_request) VALUES (?)`, [values]);
        }
        catch(err) {
            console.error(err);
        }
    }

    addPoints(numPoints, login) {
        let values = [numPoints, login];
        try{
            return db_connexion.queryValues(`UPDATE utilisateur SET points = points + ? WHERE username = ?`, values);
        }
        catch(err) {
            console.error(err);
        }
    }

    addPointsWithCallback(numPoints, login, callback) {
        let values = [numPoints, login];
        try{
            db_connexion.queryValuesCallback(`UPDATE utilisateur SET points = points + ? WHERE username = ?`, values, callback);
        }
        catch(err) {
            console.error(err);
        }
    }

    removePoints(numPoints, login) {
        let values = [numPoints, login];
        try{
            return db_connexion.queryValues(`UPDATE utilisateur SET points = points - ? WHERE username = ?`, values);
        }
        catch(err) {
            console.error(err);
        }
    }

    removePointsWithCallback(numPoints, login, callback) {
        let values = [numPoints, login];
        try{
            db_connexion.queryValuesCallback(`UPDATE utilisateur SET points = points - ? WHERE username = ?`, values, callback);
        }
        catch(err) {
            console.error(err);
        }
    }
    
    updateProgression(id_utilisateur, id_badge, increment) {
        try{
            return db_connexion.query(`UPDATE utilisateur_badge SET progression = progression + ${increment} WHERE id_utilisateur = ${id_utilisateur} AND id_badge = ${id_badge}`);
        }
        catch(err) {
            console.error(err);
        }
    }
}

module.exports = { DatabaseFunctions: DatabaseFunctions }