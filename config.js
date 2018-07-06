module.exports = {
  "production": {
    database: "tennis-portal-db",
    username: "postgres",
    password: "12345678",
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false
  },
  "development": {
    database: "tennis-portal-db",
    username: "postgres",
    password: "12345678",
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    logging: true,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false
  }
}