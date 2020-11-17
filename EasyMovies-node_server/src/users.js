const fileUpload = require('express-fileupload');
const sha256 = require('crypto-js/sha256');
const dbAdapter = require('./dbAdapter');
const dataChecker = require('./dataChecker');
const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('./exceptionHandler');
const { v4: uuidv4 } = require('uuid');

registerUser = async (req, res) => {
  if (process.env.NODE_ENV === "production") {//si cambia nello start di package.json
    if (!req.files || !req.files.img) {
      throw new BadRequestException();
    }
    req.files.img.mv(`./resources/profile_imgs/${req.body.username}.jpg`, function (err) {
      if (err)
        throw new InternalServerErrorException();
    });
  }

  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const surname = req.body.surname;
  console.log(req.body);
  if (dataChecker.checkFieldsNull([username, password, name, surname]))
    throw new BadRequestException();
  if (await dataChecker.checkUsername(username))
    throw new ConflictException();
  const hashedPw = sha256(password).toString();
  const user = {
    "username": username,
    "password-hash": hashedPw,
    "name": name,
    "surname": surname
  }
  const created = await adapterCreateUser(user).catch(e => console.log("Error: user already exists"));
  if (!created)
    throw new InternalServerErrorException();
  res.status(200).send()
}

loginUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (dataChecker.checkFieldsNull([username, password]))
    throw new BadRequestException();
  const hashedPw = sha256(password).toString();
  const logged = await adapterCheckUserCredentials(username, hashedPw);
  if (logged) {
    const uuid = uuidv4();
    await saveUuid(username, uuid);
    res.cookie("sessionId", uuid, {httpOnly: true});
    res.status(200).send()
  }
  else
    throw new UnauthorizedException();
}

logoutUser = async (req, res) => {
  console.log(req.cookies.sessionId);
  const username = req.params.username;
  if (dataChecker.checkFieldsNull([username, req.cookies]) || dataChecker.checkFieldsNull([req.cookies.sessionId]))
    throw new BadRequestException();
  if (!( await dataChecker.checkUsername(username)))
    throw new NotFoundException();
  const uuid = req.cookies.sessionId;
  await deleteUuid(username, uuid);
  res.clearCookie('sessionId');
  res.status(200).send();
}

getUserDetails = async (req, res) => {
  const username = req.params.username;
  if (dataChecker.checkFieldsNull([username]))
    throw new BadRequestException();
  const details = await adapterGetUserDetails(username);
  delete details['password-hash'];
  if (details)
    res.status(200).send(details);
  else
    throw new NotFoundException();
}

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
  registerUser,
  loginUser,
  getUserDetails,
  getPlaylists,
  addMovieToPlaylist,
  removeMovieFromPlaylist,
  createPlaylist,
  deletePlaylist,
  editPlaylistName,
  logoutUser
}