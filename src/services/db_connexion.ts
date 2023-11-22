import mysql from "mysql";
const config = require("../config");

export default function query (sql: string) {
    const con = mysql.createConnection(config.db);
    var resultat = '';

    con.connect(function(err: any) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + con.threadId);
        });
    
    con.query(sql, function (err: any, result: any) {
        if (err) throw err;
        resultat = result;
        });
    
    con.end(function(err: any) {
            if (err) throw err;
        });
    return resultat;
}