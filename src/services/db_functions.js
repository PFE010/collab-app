"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getfulltable = void 0;
var db_connexion_1 = require("./db_connexion");
function getfulltable(tableName) {
    return (0, db_connexion_1.default)("SELECT * FROM ".concat(tableName));
}
exports.getfulltable = getfulltable;
