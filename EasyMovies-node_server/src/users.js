const fileUpload = require('express-fileupload');
const sha256 = require('crypto-js/sha256');
const { MongoError } = require('mongodb');
const dbAdapter = require('./dbAdapter');
const dataChecker = require('./dataChecker');

registerUser = async (req, res) => {
    if (process.env.NODE_ENV === "production") {//si cambia nello start di package.json
      if (!req.files || !req.files.img) {
        throw new BadRequestException();
      }
      req.files.img.mv(`./resources/profile_imgs/${req.query.username}.jpg`, function (err) {
        if (err)
          throw new InternalServerErrorException();
      });
    }

    const username = req.query.username;

    dataChecker.checkUsername(username).catch(() => res.status(500).send());

    const password = req.query.password;
    const name = req.query.name;
    const surname = req.query.surname;
    const hashedPw = sha256(password).toString();
    const user = {
      "username": username,
      "password-hash": hashedPw,
      "name": name,
      "surname": surname
    }
    const created = await adapterCreateUser(user).catch(e => console.log("user already exists"));
    created ? res.status(201).send() : res.status(401).send();
}

loginUser = async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  const hashedPw = sha256(password).toString();
  const logged = await adapterCheckUserCredentials(username, hashedPw);
  logged ? res.status(200).send() : res.status(401).send();
}

getUserProfilePic = (req, res) => {
  res.sendFile(`./resources/profile_imgs/${req.params.username}.jpg`, { root: __dirname });
}

getUserDetails = async (req, res) => {
  const username = req.params.username;
  const details = await adapterGetUserDetails(username);
  delete details['password-hash'];
  details ? res.status(200).send(details) : res.status(404).send();
}

getPlaylists = async (req, res) => {
  const username = req.params.username;
  let ret = [];
  const playlists = await adapterGetPlaylists(username);

  !playlists ? res.status(404).send() : null;
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