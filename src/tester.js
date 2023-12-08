const db_functions = require('./services/db_functions');
const tester = require('./helper');

const db_con = new db_functions.DatabaseFunctions();

//TEST HERE
var date = '1999-08-11T04:00:00.000Z'
console.log(tester.convertDate(date));
db_con.getfulltable('pull_request');

//db_con.closeConnection();
