const dataChecker = require('../libs/dataChecker');
const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('../libs/exceptionHandler');
const dbAdapter = require('../libs/dbAdapter');

getPlaylists = async (req, res) => {
    const username = req.params.username;
    let ret = [];
    const playlists = await adapterGetPlaylists(username);
  
    if (!playlists)
      throw new NotFoundException();
    // console.log(playlists);
    let i = 0
    for await (let p of playlists) {
      ret[i] = { playlistName: p.name, movies: [] };
      for await (let m of p.movies) {
        let toAdd = await adapterGetMovieDetails(m);
        toAdd ? ret[i].movies.push(toAdd) : null;
        // console.log(toAdd.title);
      }
      i++;
    };
    res.status(200).send(ret);
  }
  
  addMovieToPlaylist = async (req, res) => {
    const username = req.params.username;
    const playlist = req.params.playlist;
    const movie = req.body.movieId;
    if (dataChecker.checkFieldsNull([username, playlist, movie]))
      throw new BadRequestException();
    await dbAdapter.readQueryWrapper("Playlists", {
      "username": username,
      "name": playlist,
    }).then(r => {
      if (r.length == 0) {
        throw new NotFoundException();
      }
    });
    adapterAddMovieToPlaylist(username, playlist, movie).then(r => {
      res.status(200).send();
    })
  }
  
  removeMovieFromPlaylist = async (req, res) => {
    const username = req.params.username;
    const playlist = req.params.playlist;
    const movie = req.body.movieId;
    if (dataChecker.checkFieldsNull([username, playlist, movie]))
      throw new BadRequestException();
    await dbAdapter.readQueryWrapper("Playlists", {
      "username": username,
      "name": playlist
    }).then(r => {
      if (r.length == 0) {
        throw new NotFoundException();
      }
    });
    adapterRemoveMovieFromPlaylist(username, playlist, movie).then(r => {
      res.status(200).send();
    })
  }
  
  createPlaylist = async (req, res) => {
    const username = req.params.username;
    const playlist = req.body.playlist;
    if (dataChecker.checkFieldsNull([username, playlist]))
      throw new BadRequestException();
    if (! await dataChecker.checkUsername(username))
      throw new NotFoundException();
    await adapterCreatePlaylist(username, playlist).then(r => {
      res.status(201).send();
    });
  }
  
  deletePlaylist = async (req, res) => {
    const username = req.params.username;
    const playlist = req.body.playlist;
    if (dataChecker.checkFieldsNull([username, playlist]))
      throw new BadRequestException();
    if (! await dataChecker.checkUsername(username))
      throw new NotFoundException();
    await adapterDeletePlaylist(username, playlist).then(r => {
      res.status(200).send();
    });
  }
  
  editPlaylistName = async (req, res) => {
    const username = req.params.username;
    const oldName = req.params.playlist;
    const newName = req.body.newName;
    if (dataChecker.checkFieldsNull([username, oldname]))
      throw new BadRequestException();
    await dbAdapter.readQueryWrapper("Playlists", {
      "username": username,
      "name": playlist
    }).then(r => {
      if (r.length == 0) {
        throw new NotFoundException();
      }
    });
    await adapterEditPlaylistName(username, oldName, newName).then(r => {
      res.status(200).send();
    });
  };

  module.exports = {
    getPlaylists,
    addMovieToPlaylist,
    removeMovieFromPlaylist,
    createPlaylist,
    deletePlaylist,
    editPlaylistName,
  }