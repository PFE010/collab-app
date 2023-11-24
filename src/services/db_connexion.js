var mysql = require("mysql");
var config = require("../../config");

function query(sql) {
    const connection = mysql.createConnection(config.db);

    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
    });

    connection.end(function(err) {
        // The connection is terminated now
    });
}

module.exports = {
    query
}
