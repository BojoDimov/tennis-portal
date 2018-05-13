var crypto = require('crypto');
var hasher = crypto.createHash('sha256');

let salt = crypto.randomBytes(16);
hasher.update(salt.toString('utf8') + "levski1914");
let hash = hasher.digest('hex');
console.log(hash);