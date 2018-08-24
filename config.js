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
      min: "0553292350",
      secret: "J8Z3TXF2E53Y4QSAK0R26OIMRIJXBDOFMBVTN56HQG6N604RD9Q6COEGISLI70NF"
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
      min: "D252247444",
      secret: "S9TUFF9FKSN2G0QIPV8U9IY800ROJ059OHA63PJCT0BDD9EA98GEJR1YSPMNV9O5"
    }
  }
}