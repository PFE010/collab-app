var db_connexion = require("./db_connexion");

function getfulltable(tableName) {
    return (0, db_connexion.default)("SELECT * FROM ".concat(tableName));
}
exports.getfulltable = getfulltable;
