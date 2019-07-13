//User Model that will map to "User" documents in the DB.

'use strict'

var mongoose = require('mongoose'); //Imports mongoose module
var Schema = mongoose.Schema; 

var UserSchema = Schema({ //User schema creation
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
})

module.exports = mongoose.model('User', UserSchema); //The schema is exported to be used...