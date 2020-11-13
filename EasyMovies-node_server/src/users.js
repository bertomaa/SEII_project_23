const fileUpload = require('express-fileupload');
const sha256 = require('crypto-js/sha256');
const { MongoError } = require('mongodb');
const dbAdapter = require('./dbAdapter');
const dataChecker = require('./dataChecker');
const exceptionHandler = require('./exceptionHandler');
const { NotFoundException } = require('./exceptionHandler');

registerUser = async (req, res) => {
    if (process.env.NODE_ENV === "production") {//si cambia nello start di package.json
      if (!req.files || !req.files.img) {
        throw new exceptionHandler.BadRequestException();
      }
      req.files.img.mv(`./resources/profile_imgs/${req.body.username}.jpg`, function (err) {
        if (err)
          throw new exceptionHandler.InternalServerErrorException();
      });
    }

    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const surname = req.body.surname;
    console.log(req.body);
    if(dataChecker.checkFieldsNull([username, password, name, surname]))
      throw new exceptionHandler.BadRequestException();
    if(await dataChecker.checkUsername(username))
      throw new exceptionHandler.ConflictException();
    const hashedPw = sha256(password).toString();
    const user = {
      "username": username,
      "password-hash": hashedPw,
      "name": name,
      "surname": surname
    }
    const created = await adapterCreateUser(user).catch(e => console.log("Error: user already exists"));
    if(!created)
      throw new exceptionHandler.InternalServerErrorException();
    res.status(201).send();
}

loginUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(dataChecker.checkFieldsNull([username, password]))
    throw new exceptionHandler.BadRequestException();
  const hashedPw = sha256(password).toString();
  const logged = await adapterCheckUserCredentials(username, hashedPw);
  if(logged) 
    res.status(200).send()
  else
    throw new exceptionHandler.UnauthorizedException();
}

getUserProfilePic = (req, res) => {
  res.sendFile(`./resources/profile_imgs/${req.params.username}.jpg`, { root: __dirname });
}

getUserDetails = async (req, res) => {
  const username = req.params.username;
  const details = await adapterGetUserDetails(username);
  delete details['password-hash'];
  if(details) 
    res.status(200).send(details);
  throw new exceptionHandler.NotFoundException();
}

getPlaylists = async (req, res) => {
  const username = req.params.username;
  let ret = [];
  const playlists = await adapterGetPlaylists(username);

  if(!playlists)
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
  const movie = req.query.movie;
  adapterAddMovieToPlaylist(username, playlist, movie);
}

removeMovieFromPlaylist = async (req, res) => {
  const username = req.params.username;
  const playlist = req.params.playlist;
  const movie = req.query.movie;
  adapterRemoveMovieFromPlaylist(username, playlist, movie);
}

createPlaylist = async (req, res) => {
  const username = req.params.username;
  const playlist = req.query.playlist;
  adapterCreatePlaylist(username, playlist);
}

deletePlaylist = async (req, res) => {
  const username = req.params.username;
  const playlist = req.query.playlist;
  adapterDeletePlaylist(username, playlist);
}

editPlaylistName = async (req, res) => {
  const username = req.params.username;
  const oldName = req.params.playlist;
  const newName = req.query.newName;
  adapterEditPlaylistName(username, oldName, newName);
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfilePic,
  getUserDetails,
  getPlaylists,
  addMovieToPlaylist,
  removeMovieFromPlaylist,
  createPlaylist,
  deletePlaylist,
  editPlaylistName
}