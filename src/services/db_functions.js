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

function createUser(nom, prenom, courriel) {
    let values = [nom, prenom, courriel];
    try {
        db_connexion.queryValues("INSERT INTO utilisateur (nom, prenom, courriel) VALUES (?, ?, ?)", values);
    }
    catch(err) {
        console.error(err);
    }
}

function createPR(url, description, date_creation, date_merge, date_last_update, status, labels) {
    let values = [url, description, date_creation, date_merge, date_last_update, status, labels];
    try {
        db_connexion.queryValues("INSERT INTO pull_request (url, description, titre, date_creation, date_merge, date_last_update, status, labels) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", values);
    }
    catch(err) {
        console.error(err);
    }
}

function deleteUser(userId) {
    try {
        db_connexion.queryValues("DELETE FROM utilisateur WHERE id_utilisateur = ?", userId);
    }
    catch(err) {
        console.error(err);
    }
}

//update user with values [nom, prenom, courriel, id_utilisateur]
function updateUser(newNom, newPrenom, newCourriel, userId) {
    let values = [newNom, newPrenom, newCourriel, userId];
    try {
        db_connexion.queryValues("UPDATE utilisateur SET nom = ?, prenom = ?, courriel = ? WHERE id_utilisateur = ?", values);
    }
    catch(err) {
        console.error(err);
    }
}

function createBadges(values) {
    try {
        db_connexion.queryValues(`INSERT INTO badge (titre, description) VALUES ?`, [values]);
    }
    catch(err) {
        console.error(err);
    }
}

function deleteBadge(badgeId) {
    try {
        db_connexion.queryValues("DELETE FROM badge WHERE id_badge = ?", badgeId);
    }
    catch(err) {
        console.error(err);
    }
}

function createPaliers(values) {
    try {
        db_connexion.queryValues(`INSERT INTO palier (points_attrib, titre_palier, nb_action_requise, image) VALUES ?`, [values]);
    }
    catch(err) {
        console.error(err);
    }
}

function deletePalier(palierId) {
    try {
        db_connexion.queryValues("DELETE FROM palier WHERE id_palier = ?", palierId);
    }
    catch(err) {
        console.error(err);
    }
}

module.exports = {
    getfulltable,
    seeTables,
    createUser,
    deleteUser,
    updateUser,
    createPR,
    createBadges,
    deleteBadge,
    createPaliers,
    deletePalier
}
