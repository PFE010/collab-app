const { DatabaseFunctions } = require('./src/services/db_functions')


var number = "51";
var url = "testurl51"
var description = "descriptiontest"
var titre = "titretest"
var date_creation = "1111-05-30"
var date_merge = "1111-06-30"
var date_last_update = "1111-06-30"
var status = "opened"
var labels = 'label1, label2'

const db_functions = new DatabaseFunctions()


db_functions.getfulltable("pull_request");
