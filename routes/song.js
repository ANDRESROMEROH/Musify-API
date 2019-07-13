
'use strict'

//App for controlling song routes (URLs)

var express = require('express');
var SongController = require('../controllers/song');
var md_auth = require('../middleware/authentication');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs' });

var api = express.Router();

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getAllSongs);
api.post('/save-song', md_auth.ensureAuth, SongController.saveSong);
api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/delete-song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);

module.exports = api;