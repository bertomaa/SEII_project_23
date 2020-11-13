const exceptionHandler = require('./exceptionHandler');

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

let dbo;
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbo = db.db("easyMovies");
});

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
    }).catch((e) => {throw new exceptionHandler.InternalServerErrorException()});
}

const updateQueryWrapper = async (collection, obj, toAdd, onlyFirst) => {
    return new Promise((resolve, reject) => {
        updateQuery(collection, obj, toAdd, resolve, reject, onlyFirst)
    }).catch((e) => {throw new exceptionHandler.InternalServerErrorException()});
}

const insertQueryWrapper = async (collection, toInsert, onlyFirst) => {
    return new Promise((resolve, reject) => {
        insertQuery(collection, toInsert, resolve, reject, onlyFirst)
    }).catch((e) => {throw new exceptionHandler.InternalServerErrorException()});
}

const deleteQueryWrapper = async (collection, toDelete, onlyFirst) => {
    return new Promise((resolve, reject) => {
        deleteQuery(collection, toDelete, resolve, reject, onlyFirst)
    }).catch((e) => {throw new exceptionHandler.InternalServerErrorException()});
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


adapterGetMovieDetails = async (movieId) => {
    return await readQueryWrapper("Movies", {
        "imdb_title_id": movieId,
    }, true)
}


//#####################################################
// RECENSIONI
//#####################################################


adapterGetMovieReviews = async (movieId) => {
    return await readQueryWrapper("Reviews", {
        "movieId": movieId,
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
    insertQueryWrapper
}