const { DatabaseFunctions } = require('./services/db_functions');
const express = require('express');
const cors = require("cors");

module.exports = async (app, getRouter) => {
    const db_functions = new DatabaseFunctions()

    // Get an express router to expose new HTTP endpoints
    const router = getRouter("/collab-app");

    // Use any middleware
    router.use(require("express").static("public"));

    // Get all pull requests
    router.get("/pullRequests", (req, res) => {
    db_functions.fetchAllPr((result) => {
        console.log(result);
        res.send(result)});
    });

    router.get("/users", (req, res) => {
    db_functions.getfulltableWithCallback('utilisateur', (users) => {
        db_functions.getfulltableWithCallback('utilisateur_badge', (userBadges) => {
        db_functions.getfulltableWithCallback('badge_palier', (badgePaliers) => {
            db_functions.getfulltableWithCallback('palier', (paliers) => {
            const response = users.map(user => {
                let badges = []
                
                userBadges.filter(userBadge => userBadge.id_utilisateur == user.id_utilisateur && userBadge.numero_palier > 0).forEach(userBadge => {
                badgePaliers.filter(badgePalier => badgePalier.id_badge == userBadge.id_badge).forEach(badgePalier => {
                    paliers.filter(palier => palier.id_palier == badgePalier.id_palier && palier.tier == userBadge.numero_palier).forEach(palier => {
                    badges.push(palier);
                    })
                })
                })
                return {
                ...user,
                badges: badges
                }
            });
            console.log(response)
            res.send(response);
            })
        })
        })
    });
    })
}; 