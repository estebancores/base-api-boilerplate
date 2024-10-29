import dotenv from 'dotenv';
dotenv.config({ path: "../../../.env" })

const knexEnvironments = {
  development: {
    client: "pg",
    connection: process.env.POSTGRES_URI,
    migrations: {
      tableName: "knex_migrations",
    },
    useNullAsDefault: true,
  },
  staging: {},
  production: {}
};

export default knexEnvironments;