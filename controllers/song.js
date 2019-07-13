'use strict'

var path = require('path');
var fs = require('fs');
var mongosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if (err) {
            res.status(500).send({message: 'Request error.'})
        } else {
            if (!song) {
                res.status(404).send({message: 'The song does not exist.'});
            } else {
                res.status(200).send({song});
            }
        }
    });
}

function getAllSongs(req, res) {
    var albumId = req.params.album;

    if (!labumId) {
        var find = Song.find({}).sort('number');
    } else {
        var find = Son.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({message: 'There was an error with the request'});
        } else {
            if (!songs) {
                res.status(404).send({message: 'There are not songs!'});
            } else {
                res.status(200).send({songs});
            }
        }
    });
}

function saveSong(req, res) {
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err, songStored) => 
            {
                if (err) {
                    res.status(500).send({message: 'There was an error saving the song.'});
                }else{
                    if (!songStored) {
                        res.status(404).send({message: "Song was not saved."});
                    } else {
                        res.status(200).send({song: songStored});
                    }
                }
            }
    );
}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, updatedSong) => {
        if (err) {
            res.status(500).send({message: 'There was an error updating the song.'});
        }else{
            if (!updatedSong) {
                res.status(404).send({message: "Song was not updated."});
            } else {
                res.status(200).send({song: updatedSong});
            }
        }
    });
}

function deleteSong(req, res) {
    var songId = req.params.id;
    Song.findByIdAndDelete(songId, (err, deletedSong) => {
        if (err) {
            res.status(500).send({message: 'There was an error deleting the song.'});
        }else{
            if (!deletedSong) {
                res.status(404).send({message: "Song was not deleted."});
            } else {
                res.status(200).send({song: deletedSong});
            }
        }
    });

}

function uploadFile(req, res) {
    var songId = req.params.id;
    var fileName = 'Not uploaded';

    if (req.files) {

        // It separates the file name so it can be stored in the data base and be linked to the actual file stored in the HDD
        var filePath = req.files.file.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];
        var extSplit = fileName.split('\.');
        var extension = extSplit[1];
        /*-----------------------------------*/

        if (extension == 'mp3' || extension == 'ogg') {
            Song.findByIdAndUpdate(songId, {file: fileName}, (err, song) => {
                if (err) {
                    res.status(404).send({message: "It was not possible to update the song..."});
                } else {
                    res.status(200).send({song: song});
                }
            });
        } else {
            res.status(200).send({message: 'Extension is not valid...'});
        }

    } else {
        res.status(200).send({message: 'No song was uploaded...'});
    }
}

function getSongFile(req, res) {
    var songFile = req.params.songFile;
    fs.exists('./uploads/songs/' + songFile, function (exists) {
        if (exists) {
            res.sendFile(path.resolve('./uploads/songs/' + songFile));
        } else {
            res.status(200).send({message: 'Song does not exist...'});
        }
    });
}

module.exports = {
    getSong,
    getAllSongs,
    saveSong,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};