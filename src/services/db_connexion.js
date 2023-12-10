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

function queryValuesPromise(sql, values) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err); // Reject the Promise if there's an error getting the connection
          return;
        }
  
        connection.query(sql, values, (err, result) => {
          connection.release();
  
          if (err) {
            reject(err); // Reject the Promise if there's an error executing the query
            return;
          }
  
          console.log("Number of records inserted: " + result.affectedRows);
          resolve(result); // Resolve the Promise with the query result
        });
      });
    });
}

module.exports = {
    query,
    queryCallback,
    queryValues,
    queryValuesCallback,
    endConnection,
    queryValuesPromise
}
