# Tennis Portal Diana
Application for managing courts and tournaments

## Installation
### Prerequisites:
1. NodeJS & npm installed
2. PostgreSQL 10.0/11.0 server installed
3. PgAdmin or other server management UI

### Installation
1. Unzip
2. npm install
3. create file .env
4. populate values for .env file:
```shell
# Application directories config
# This is DEV Configuration, for PROD check in the hosting directory
APPLICATION_ROOT=../
DOCUMENT_ROOT=../build/

# Application DB config
DB_HOST=<host>
DB_PORT=<port>
DB_USER=<dbuser>
DB_PASSWORD=<dbpassword>
DB=<dbname>

# Application server config
PORT=4000
TYPE=dev

# Application Email server config
CLIENT_HOST=http://localhost:3000
SMTP_HOST=mail.tennisdiana.com
SMTP_PORT=465
SMTP_USERNAME=<username>
SMTP_PASSWORD=<password>

# Application bussiness logic parameters
CANCEL_RES_ALLOWED_DIFF=4
CUSTOM_ALLOWED_DIFF=8
```
5. create your database
6. run sequelize db migration with the command
```shell
node server/dbsync.js
```
7. For DEV startup you should comment out those lines in `public/index.html`
```html
<script>
    window.configuration = {
      backend: "https://booking.tennisdiana.com/api"
    };
</script>
```
7. ```node server```
8. ```npm start```

### Building for production
Change the above configuration to the proper domain

```shell
npm run build
```

The built application is located in ./build

### Useful links
https://fenix.livehostserver.com:8443/login_up.php?success_redirect_url=https%3A%2F%2Ffenix.livehostserver.com%3A8443%2F - Hosting server
http://tennisdiana.com.51-158-24-11.livehostserver.com/pgadmin/ - phpPgAdmin for that specific host (passwords and usernames are located inside .env file in the hosting dir)
  