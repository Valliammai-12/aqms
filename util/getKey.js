const Auth = require('../authentication');
console.log("Salt : ",Auth.generateSalt());
console.log("Secret Key: ",Auth.generateSecretKey());