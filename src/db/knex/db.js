import knexEnvironments from "./config.js";
import * as knexPkg from "knex";
const environment =  process.env.NODE_ENV || "development";
const db = knexPkg.default(knexEnvironments[environment]);

export { db };
