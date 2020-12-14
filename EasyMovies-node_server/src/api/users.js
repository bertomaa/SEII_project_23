const fileUpload = require('express-fileupload');
const sha256 = require('crypto-js/sha256');
const dbAdapter = require('../libs/dbAdapter');
const dataChecker = require('../libs/dataChecker');
const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('../libs/exceptionHandler');
const jwt = require('jsonwebtoken');
const fs  = require('fs');

const privateKey = fs.readFileSync('./private.key', 'utf8');

registerUser = async (req, res) => {
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
  if (process.env.NODE_ENV === "production") { //si cambia nello start di package.json
    if (!req.body.image) {
      throw new BadRequestException();
    }
    var base64Data = req.body.image.replace(/^data:image\/jpeg;base64,/, "");
    fs.writeFile(`public/profile-images/${req.body.username}.jpg`, base64Data, 'base64', function (err) {
      console.log(err);
      throw new InternalServerErrorException();
    });
    // req.files.img.mv(`../resources/profile_imgs/${req.body.username}.jpg`, function (err) {
    //   if (err)
    //     throw new InternalServerErrorException();
    // });
  }
  res.status(201).send()
}

loginUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (dataChecker.checkFieldsNull([username, password]))
    throw new BadRequestException();
  if (! await dataChecker.checkUsername(username))
    throw new NotFoundException();
  const hashedPw = sha256(password).toString();
  const logged = await adapterCheckUserCredentials(username, hashedPw);
  if (logged) {
    const token = jwt.sign({username: username}, privateKey, {expiresIn: 86400, algorithm: "RS256"});
    res.cookie("JWTtoken", token);
    res.cookie("username", username);
    res.status(200).json({"JWTtoken": token, "username": username});
  } else
    throw new UnauthorizedException();
}

logoutUser = async (req, res) => {
  const username = req.params.username;
  if (dataChecker.checkFieldsNull([username, req.cookies]) || dataChecker.checkFieldsNull([req.cookies.JWTtoken]))
    throw new BadRequestException();
  if (!(await dataChecker.checkUsername(username)))
    throw new NotFoundException();
  res.clearCookie("username");
  res.clearCookie('JWTtoken');
  res.status(200).send();
}

deleteUser = async (req, res) => {
  const username = req.params.username;
  if (dataChecker.checkFieldsNull([username, req.cookies]) || dataChecker.checkFieldsNull([req.cookies.JWTtoken]))
    throw new BadRequestException();
  if (!(await dataChecker.checkUsername(username)))
    throw new NotFoundException();
  await adapterDeleteUser(username);
  res.clearCookie("username");
  res.clearCookie('JWTtoken');
  res.status(200).send();
}

getUserDetails = async (req, res) => {
  const username = req.params.username;
  if (dataChecker.checkFieldsNull([username]))
    throw new BadRequestException();
  const details = await adapterGetUserDetails(username);
  if (details) {
    delete details['password-hash'];
    delete details['_id'];
    if(details.sessions)
      delete details['sessions'];
    res.status(200).send(details);
  } else
    throw new NotFoundException();
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  deleteUser
}