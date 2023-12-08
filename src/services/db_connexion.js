var mysql = require("mysql");
var config = require("../../config");

var pool = mysql.createPool(config.db);

function endConnection() {
    pool.end(function(err) {
        // The connection is terminated now
    });
}

function query(sql) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql, function (err, result) {
            connection.release();
            if (err) throw err;

            console.log("query success");
        });
    });
}

function queryCallback(sql, callback) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql, function (err, result) {
            connection.release();
            if (err) throw err;

            callback(result);
        });
    });
}

function queryValues(sql, values) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql, values, function (err, result) {
            connection.release();
            if (err) throw err;

            console.log("Number of records inserted: " + result.affectedRows);
        });
    }); 
}

function queryValuesCallback(sql, values, callback) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql, values, function (err, result) {
            connection.release();
            if (err) throw err;

            callback(result);
        });
    }); 
}

module.exports = {
    query,
    queryCallback,
    queryValues,
    queryValuesCallback,
    endConnection
}
