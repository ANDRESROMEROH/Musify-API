
'use strict'

//App for controlling artist routes (URLs)

var express = require('express');
var ArtistController = require('../controllers/artist');
var md_auth = require('../middleware/authentication');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists' });

var api = express.Router();

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getAllArtists);
api.post('/save-artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/delete-artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;