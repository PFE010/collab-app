import query from "./db_connexion";

export function getfulltable(tableName: string) {
    return query(`SELECT * FROM ${tableName}`)
}