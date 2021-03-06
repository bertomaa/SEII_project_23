const exceptionHandler = require('./exceptionHandler');
const tmdbApi = require('./tmdbApi');

var MongoClient = require('mongodb').MongoClient;

const url = process.env.MONGODB_URL || "mongodb://localhost:27017/";

let db;
let dbo;

MongoClient.connect(url, function (err, dataBase) {
    if (err) throw err;
    db = dataBase;
    dbo = db.db("easyMovies");
});

function initDB() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, dataBase) {
            if (err) reject();
            db = dataBase;
            dbo = dataBase.db("easyMovies");
            resolve();
        });
    });
}

function closeDB() {
    return new Promise((resolve, reject) => {
        db.close((err) => { if (err) reject(); else resolve(); });

    });
}

//#####################################################
// METODI DATABASE
//#####################################################

function handleResult(queryErr, queryRes, resolve, reject) {
    if (queryErr) {
        reject();
    } else {
        resolve(queryRes);
    }
}

async function readQuery(collection, query, resolve, reject, one) {
    if (one)
        return await dbo.collection(collection).findOne(query, (queryErr, queryRes) => handleResult(queryErr, queryRes, resolve, reject));
    else
        return await dbo.collection(collection).find(query).toArray((queryErr, queryRes) => handleResult(queryErr, queryRes, resolve, reject));
}

async function updateQuery(collection, obj, toAdd, resolve, reject, one) {
    let res;
    if (one)
        res = await dbo.collection(collection).updateOne(obj, toAdd, (queryErr, queryRes) => handleResult(queryErr, queryRes, resolve, reject));
    else
        res = await dbo.collection(collection).updateMany(obj, toAdd, (queryErr, queryRes) => handleResult(queryErr, queryRes, resolve, reject));
}


async function insertQuery(collection, toInsert, resolve, reject, one) {
    if (one)
        return await dbo.collection(collection).insertOne(toInsert, (queryErr, queryRes) => handleResult(queryErr, queryRes, resolve, reject));
    else
        return await dbo.collection(collection).insertMany(toInsert, (queryErr, queryRes) => handleResult(queryErr, queryRes, resolve, reject));
}

async function deleteQuery(collection, toDelete, resolve, reject, one) {
    if (one)
        return await dbo.collection(collection).deleteOne(toDelete, (queryErr, queryRes) => handleResult(queryErr, queryRes, resolve, reject));
    else
        return await dbo.collection(collection).deleteMany(toDelete, (queryErr, queryRes) => handleResult(queryErr, queryRes, resolve, reject));
}

//

const readQueryWrapper = async (collection, query, onlyFirst) => {
    return new Promise((resolve, reject) => {
        readQuery(collection, query, resolve, reject, onlyFirst)
    }).catch((e) => { throw new exceptionHandler.InternalServerErrorException() });
}

const updateQueryWrapper = async (collection, obj, toAdd, onlyFirst) => {
    return new Promise((resolve, reject) => {
        updateQuery(collection, obj, toAdd, resolve, reject, onlyFirst)
    }).catch((e) => { throw new exceptionHandler.InternalServerErrorException() });
}

const insertQueryWrapper = async (collection, toInsert, onlyFirst) => {
    return new Promise((resolve, reject) => {
        insertQuery(collection, toInsert, resolve, reject, onlyFirst)
    }).catch((e) => { throw new exceptionHandler.InternalServerErrorException() });
}

const deleteQueryWrapper = async (collection, toDelete, onlyFirst) => {
    return new Promise((resolve, reject) => {
        deleteQuery(collection, toDelete, resolve, reject, onlyFirst)
    }).catch((e) => { throw new exceptionHandler.InternalServerErrorException() });
}


//#####################################################
// USERS
//#####################################################


adapterCheckUserCredentials = async (username, password) => {
    return await readQueryWrapper("Users", {
        "username": username,
        "password-hash": password
    }, true);
}

saveUuid = async (username, uuid) => {
    return await updateQueryWrapper("Users", {
        "username": username,
    }, {
        $push: {
            "sessions": uuid
        }
    }, true);
}

const checkUuid = async (username, uuid) => {
    return await readQueryWrapper("Users", {
        "username": username,
        "sessions": uuid
    }, true);
}

deleteUuid = async (username, uuid) => {
    return await updateQueryWrapper("Users", {
        "username": username,
    }, {
        $pull: {
            "sessions": uuid
        }
    }, true);
}

adapterDeleteUser = async (username) => {
    return await deleteQueryWrapper("Users", {"username": username}, true);
}

adapterCreateUser = async (user) => {
    return await insertQueryWrapper("Users", user, true);;
}

adapterGetUserDetails = async (username) => {
    return await readQueryWrapper("Users", {
        "username": username,
    }, true);
}



//#####################################################
// PLAYLISTS
//#####################################################


adapterGetPlaylists = async (username) => {
    return await readQueryWrapper("Playlists", {
        "username": username,
    });
}

adapterAddMovieToPlaylist = async (user, playlistName, movieToAdd) => {
    return await updateQueryWrapper("Playlists", {
        "username": user,
        "name": playlistName
    }, {
        $push: {
            "movies": movieToAdd
        }
    }, true)
}

adapterRemoveMovieFromPlaylist = async (user, playlistName, movieToAdd) => {
    return await updateQueryWrapper("Playlists", {
        "username": user,
        "name": playlistName
    }, {
        $pull: {
            "movies": movieToAdd
        }
    }, true)
}

adapterCreatePlaylist = async (user, playlistName) => {
    return await insertQueryWrapper("Playlists", {
        "username": user,
        "name": playlistName,
        "movies": []
    }, true)
}

adapterDeletePlaylist = async (user, playlistName) => {
    return await deleteQueryWrapper("Playlists", {
        "username": user,
        "name": playlistName
    }, true)
}

adapterEditPlaylistName = async (username, oldName, newName) => {
    return await updateQueryWrapper("Playlists", {
        "name": oldName,
        "username": username
    }, {
        $set: {
            "name": newName,
        }
    }, true)
}


//#####################################################
// MOVIES
//#####################################################


adapterGetMovieDetailsV1 = async (movieId) => {
    return await readQueryWrapper("Movies", {
        "imdb_title_id": movieId,
    }, true)
}

adapterGetHomepageMoviesV1 = async () => {
    return new Promise(async (resolve, reject) => {
        return await dbo.collection("Movies").find({}).sort({"imdb_title_id": -1}).limit(30).toArray((queryErr, queryRes) => handleResult(queryErr, queryRes, resolve, reject));
    }).catch((e) => { throw new exceptionHandler.InternalServerErrorException() });
}


adapterGetMovieDetailsV2 = async (movieId) => {
    return await tmdbApi.getTmdbMovieData(movieId);
}

adapterGetHomepageMoviesV2 = async () => {
    return await tmdbApi.getTmdbHomepageMovies();
}

adapterGetSearchResultsV2 = async (keyword) => {
    return await tmdbApi.getTmdbSearchResults(keyword);
}


//#####################################################
// REVIEWS
//#####################################################


adapterGetMovieReviews = async (movieId) => {
    return await readQueryWrapper("Reviews", {
        "movieId": movieId,
    })
}

adapterGetUserReviews = async (username) => {
    return await readQueryWrapper("Reviews", {
        "username": username,
    })
}

adapterCreateReview = async (review) => {
    return await insertQueryWrapper("Reviews", review, true)
}

adapterUpdateReview = async (review) => {
    return await updateQueryWrapper("Reviews", {
        "movieId": review.movieId,
        username: review.username
    }, {
        $set: review
    }, true)
}

adapterDeleteReview = async (username, movieId) => {
    return await deleteQueryWrapper("Reviews", {
        "username": username,
        "movieId": movieId
    }, true)
};

module.exports = {
    readQueryWrapper,
    updateQueryWrapper,
    deleteQueryWrapper,
    insertQueryWrapper,
    checkUuid,
    initDB,
    closeDB,
    adapterDeleteUser
}