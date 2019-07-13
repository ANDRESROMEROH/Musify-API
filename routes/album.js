'use strict'

//App for controlling album routes (URLs)

var express = require('express');
var AlbumController = require('../controllers/album');
var md_auth = require('../middleware/authentication');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/album' });

var api = express.Router();

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/albums/:page?', md_auth.ensureAuth, AlbumController.getAllAlbums);
api.post('/save-album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/delete-album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;