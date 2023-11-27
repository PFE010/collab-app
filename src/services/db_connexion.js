var mysql = require("mysql");
var config = require("../../config");

const connection = mysql.createConnection(config.db);

function connect() {
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
}

function endConnection() {
    connection.end(function(err) {
        // The connection is terminated now
    });
}

function queryCallback(sql, callback) {
    connection.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}

function query(sql) {
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("query success");
    });
}

function queryValues(sql, values) {
    connection.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
}

module.exports = {
    query,
    queryCallback,
    queryValues,
    connect,
    endConnection
}
