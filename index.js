const setupWebhookEvents = require('./src/index.js');

const { DatabaseFunctions } = require('./src/services/db_functions')
const express = require('express')
const cors = require("cors");
const app = express()
app.use(cors());

 /**
   * - Créer la PR (done)
   * - Supprimer la PR (done)
   * - Ajouter un label (done)
   * - Enlever un label (done)
   * - Merge la PR (done)
   * - Reopen la PR (done) 
   * - Description de la PR (done)
   * - Ajouter un commit (done)
   * - Ajouter un commentaire à la PR (done) -- issue_comment
   * - Supprimer un commentaire à la PR (done) -- issue_comment
   * - Modifier un commentaire à la PR (done) -- issue_comment
   * - Accepter une suggestion du code (done) -- part of synchronize
   * - Faire une demande de changement (done) -- part of submitted
   * - Fermer un thread (done)
   * - Ajouter des commentaires en tant que review (done)-- pull_request_review
   * - Modifier des commentaires en tant que review (done)-- pull_request_review
   * - Supprimer des commentaires en tant que review (done)-- pull_request_review
   * - Approuver une PR (done) -- part of submitted

-Réactions sur commentaires (pouce en bas)
-Réactions sur commentaires (pouce en haut)
-masquer un commentaire (fonctionne comme un flag de commentaire abusif/spam)


   */


module.exports = async (app, { getRouter }) => {
  const db_functions = new DatabaseFunctions()

  // Get an express router to expose new HTTP endpoints
  const router = getRouter("/collab-app");

  // Use any middleware
  router.use(require("express").static("public"));

  // Get all pull requests
  router.get("/pullRequests", cors(), (req, res) => {
    db_functions.fetchAllPr((result) => {
      console.log(result);
      res.send(result)});
  });

  // Get all pull users, and return all the tier badges
  router.get("/users", cors(), (req, res) => {
    db_functions.getfulltableWithCallback((users) => {
      users.foreach(user => {
        db_functions.fetchUserBadgeWithCallback(user.id_utilisateur, (userBadges) => {
          let badges = []
          userBadges.foreach(userBadge => {
            if(userBadge.numeroPalier > 0) {
              db_functions.fetchBadgePalierWithCallback(userBadge.id_badge, (badgePalier) => {
                db_functions.fetchPalierWithCallback(badgePalier.id_palier, (palier) => {
                  badges.push(palier[0]);
                })
              })
            }
          })
        })
      })


      res.send(result)});
  });

  setupWebhookEvents(app);


}; 