const dummyData = require('./assets/dummyData');
const initializeApi = require('./services/api');

class Utils {
  constructor(db) {
    this.db_functions = db;
  }

   // for testing only
  initPaliers() {
    dummyData.palierData.forEach(item => {
      const { points_attrib, titre_palier, nb_action_requise, image, tier } = item;
      this.db_functions.createPaliers(points_attrib, titre_palier, nb_action_requise, image, tier)
    })
  }

  // for testing only
  initBadges() {
    dummyData.badgesData.forEach(badge => {
      const { titre, description, action } = badge;
      this.db_functions.createBadges(titre, description, action)
    });
  }

  // for testing only
  initUserBadges() {
    this.db_functions.getfulltableWithCallback('utilisateur', (data) => {
      data.forEach(user => {
        const id_user = user.id_utilisateur;

        this.db_functions.getfulltableWithCallback('badge', (badges) => {
          badges.forEach(badge => {
            const { id_badge } = badge;
            this.db_functions.addUserBadge(id_user, id_badge, 0, 0);
          });
        })
      })
    })
  }

  // for testing only
  initBadgePalier() {
    this.db_functions.getfulltableWithCallback('badge', (badges) => {
      badges.forEach(badge => {
        console.log("badge", badge)
        const paliersBadge = dummyData.palierData.filter(palier => palier.titre_palier.includes(badge.titre))
        console.log("paliers", paliersBadge)
        paliersBadge.forEach(palier => {
          this.db_functions.getPalierWithCallback(palier.titre_palier, (data) => {
            this.db_functions.addBadgePaliers(badge.id_badge, data[0].id_palier);
          })
        })
      })
    })
  } 

  updateProgression(action, id_user, increment) {
    this.db_functions.fetchBadgeWithCallback(action, (badge) => {
      this.db_functions.updateProgressionWithCallback(id_user, badge[0].id_badge, increment, (res) => {
        this.db_functions.fetchSingleUserBadgeWithCallback(id_user, badge[0].id_badge, (userBadge) => {
          const progression = userBadge[0].progression;
          this.db_functions.fetchBadgePalierWithCallback(badge[0].id_badge, (badgePaliers) => {
            badgePaliers.forEach(badgePalier => {
              this.db_functions.fetchPalierWithCallback(badgePalier.id_palier, (palier) => {
                if(progression == palier[0].nb_action_requise) {
                  this.db_functions.updateTier(id_user, badge[0].id_badge, palier[0].tier);
                }
              }) 
            })
          })
        })
      });
    });
  }

  convertDate(date) {
    return date.slice(0, 19).replace('T', ' ');
  }

  countLabels(data) {
    if (data) {
      const labelArray = data.split(',').map(label => label.trim());
      return labelArray.length === 1 ? 1 : labelArray.length;
    } else {
      return 0;
    }
  }

  fromArrayToLabelString(labels) {
    if (!Array.isArray(labels)) {
      return ''; // Return an empty string if labels is not an array
    }

    const labelNames = labels.map(label => label.name || label);
    return labelNames.join(',');
  }

  labelStringToList(labelString) {
    if (labelString.trim() === '') {
      return []; 
    }

    return labelString.split(',').filter(label => label.trim() !== '');
  }

  printCallback(result) {
    console.log(result)
  }

  async initApi() {
    // Initialize the API
    this.api = await initializeApi();
  }

  async fetchPRDetails(url) {
    const parsedUrl = new URL(url);

    // Extracting repository owner, repo name, and pull request number
    const pathParts = parsedUrl.pathname.split('/');
    const owner = pathParts[2];
    const repo = pathParts[3];
    const prNumber = pathParts[5];

      // Fetch pr
      try {
        // Use the API instance
        const response = await this.api.fetchPRDetails(owner, repo, prNumber); 
        return response;       
      } catch (error) {
          console.error('Error:', error);
      }
  } 

  addPRToBdIfNull(pull_request, callback) {
    this.db_functions.fetchPrWithCallback(pull_request.id, (data) => {
      if(data === undefined || data.length == 0) {
        this.db_functions.addPR(pull_request.id, pull_request.url, pull_request.body, pull_request.title, this.convertDate(pull_request.created_at), null, null, pull_request.state, null);
      }

      callback();
    })
  }

  printPoints(assignee) {
    this.db_functions.fetchUserWithCallback(assignee.login, (data) => {
      console.log("----------");
      console.log("User: " + data[0].username + " now has: " + data[0].points + " points.");
    });
  }

  logEvent(context) {
    const { action, repository, pull_request, assignee} = context.payload;

    app.log.info(`Action done: ${action}\n 
    PR number: #${pull_request.number}, PR id: ${pull_request.id}, PR time creation: ${pull_request.created_at},
    PR url: ${pull_request.url}, PR status: ${pull_request.state}, PR time updated: ${pull_request.updated_at}\n
    Repository id: ${repository.id}, owner: ${repository.owner.login}, name: ${repository.name} \n
    Assigner : ${pull_request.user.login}, user_id: ${pull_request.user.id}\n
    Assignee : ${pull_request.assignee?.login || null}, user_id: ${pull_request.assignee?.id}`);
  }

  initDB(){
    
  }
}

  module.exports = Utils;
  