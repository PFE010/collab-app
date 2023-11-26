const { DatabaseFunctions } = require('./src/services/db_functions')

const db_functions = new DatabaseFunctions()

var number = "51";
var url = "testurl51"
var description = "descriptiontest"
var titre = "titretest"
var date_creation = "1111-05-30"
var date_merge = "1111-06-30"
var date_last_update = "1111-06-30"
var status = "opened"
var labels = 'label1, label2'







// console.log(db_functions.seeTables())
// console.log(db_functions.create_pr(number, url, description, titre, date_creation, date_merge, date_last_update, status, labels))
// console.log(db_functions.edit_pr(number, url, description, titre, date_creation, date_merge, date_last_update, status, labels))
console.log(db_functions.fetch_pr(51));
//console.log(db_functions.fetch_all_pr())