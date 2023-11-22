var mysql = require("mysql");
var config = require("../config.js");

function query(sql) {
    var con = mysql.createConnection(config.db);
    con.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + con.threadId);
    });
    con.query(sql, function (err, result) {
        if (err)
            throw err;
        return result;
    });
    con.end(function (err) {
        if (err)
            throw err;
    });
}
exports.default = query;
