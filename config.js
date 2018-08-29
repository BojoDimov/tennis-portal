module.exports = {
  "prod": {
    "db": {
      database: "tennis-portal-production",
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
    "client": "http://smilevent.net",
    "backend": "http://smilevent.net:8080",
    "port": 8080,
    paymentsConfig: {
    }
  },
  "test": {
    "db": {
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
    "client": "http://smilevent.net:8081",
    "backend": "http://smilevent.net:8082",
    "port": 8082
  },
  "dev": {
    "db": {
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
    "client": "http://localhost:3000",
    "backend": "http://localhost:8080",
    "port": 8080,
    paymentsConfig: {
    }
  }
}