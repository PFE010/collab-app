var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "leo",
    password: "teamPFE010",
    database: "test"
});

con.connect(function(err: any) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + con.threadId);
});

var sql = 'SELECT * FROM pet WHERE name = \'Alain\';';
con.query(sql, function (err: any, result: any, fields: any) {
    if (err) throw err;
    console.log("Result: " + result + "\nFields: " + fields);
    console.log(result);
    console.log(fields);
    });

con.end(function(err: any) {
        if (err) throw err;
    });