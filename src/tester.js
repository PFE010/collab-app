"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_functions_1 = require("./services/db_functions");
var table = (0, db_functions_1.getfulltable)('pet');
console.log(table);
