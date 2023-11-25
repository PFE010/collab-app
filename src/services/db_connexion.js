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

function query(sql, callback) {
    connection.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}

module.exports = {
    query,
    connect,
    endConnection
}
