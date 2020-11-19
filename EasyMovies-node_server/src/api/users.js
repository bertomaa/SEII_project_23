const fileUpload = require('express-fileupload');
const sha256 = require('crypto-js/sha256');
const dbAdapter = require('../libs/dbAdapter');
const dataChecker = require('../libs/dataChecker');
const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('../libs/exceptionHandler');
const { v4: uuidv4 } = require('uuid');

registerUser = async (req, res) => {
  if (process.env.NODE_ENV === "production") { //si cambia nello start di package.json
    if (!req.files || !req.files.img) {
      throw new BadRequestException();
    }
    req.files.img.mv(`../resources/profile_imgs/${req.body.username}.jpg`, function (err) {
      if (err)
        throw new InternalServerErrorException();
    });
  }

  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const surname = req.body.surname;
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
  res.status(201).send()
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
    res.cookie("sessionId", uuid, { httpOnly: true });
    res.status(200).send()
  } else
    throw new UnauthorizedException();
}

logoutUser = async (req, res) => {
  console.log(req.cookies);
  const username = req.params.username;
  if (dataChecker.checkFieldsNull([username, req.cookies]) || dataChecker.checkFieldsNull([req.cookies.sessionId]))
    throw new BadRequestException();
  if (!(await dataChecker.checkUsername(username)))
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
  if (details) {
    delete details['password-hash'];
    res.status(200).send(details);
  } else
    throw new NotFoundException();
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails
}