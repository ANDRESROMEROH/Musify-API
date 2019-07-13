'use strict'

//App for controlling user routes (URLs)

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middleware/authentication');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

var api = express.Router();

api.get('/controller-test', md_auth.ensureAuth, UserController.testing);
api.post('/save-user', UserController.saveUSer);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser); //User ID is mandatory...
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload] ,UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);


module.exports = api;