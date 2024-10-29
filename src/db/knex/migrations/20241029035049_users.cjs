/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.string("id").primary();
      table.string("name");
      table.string("surname");
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("refresh_token");
      table.string("phone");
      table.enu("verification", ["Unverified", "Verified"]).defaultTo("Unverified");
      table.boolean("status").defaultTo("true");
      table.timestamps(true, true);
      table.unique(["email"]);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("users");
};
