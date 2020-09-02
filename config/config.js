// Require and configure dotenv module, which loads environment variables from a .env file into process.env
require('dotenv').config(); 

const environment = {
    port: 3000,
    mongo: {
        host: 'localhost:27017'
    },
    jwt: {
        key: process.env.JWT_KEY
    } 
};

// Exports the config module
module.exports = environment;