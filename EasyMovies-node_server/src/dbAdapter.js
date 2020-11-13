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


//#####################################################
// USERS
//#####################################################

const readQueryWrapper = async (collection, query, onlyFirst) => {
    return new Promise((resolve, reject) => {
        readQuery(collection, query, resolve, reject, onlyFirst)
    });
}

const updateQueryWrapper = async (collection, obj, toAdd, onlyFirst) => {
    return new Promise((resolve, reject) => {
        updateQuery(collection, obj, toAdd, resolve, reject, onlyFirst)
    });
}

const insertQueryWrapper = async (collection, toInsert, onlyFirst) => {
    return new Promise((resolve, reject) => {
        insertQuery(collection, toInsert, resolve, reject, onlyFirst)
    });
}

const deleteQueryWrapper = async (collection, toDelete, onlyFirst) => {
    return new Promise((resolve, reject) => {
        deleteQuery(collection, toDelete, resolve, reject, onlyFirst)
    });
}

adapterCheckUserCredentials = async (username, password) => {
    return new Promise((resolve, reject) => {
        readQuery("Users", {
            "username": username,
            "password-hash": password
        }, resolve, reject, true)
    });
}

adapterCreateUser = async (user) => {
    return new Promise((resolve, reject) => {
        insertQuery("Users", user, resolve, reject, true)
    });
}

adapterGetUserDetails = async (username) => {
    return new Promise((resolve, reject) => {
        readQuery("Users", {
            "username": username,
        }, resolve, reject, true)
    });
}



//#####################################################
// PLAYLISTS
//#####################################################


adapterGetPlaylists = async (username) => {
    return new Promise((resolve, reject) => {
        readQuery("Playlists", {
            "username": username,
        }, resolve, reject);
    });
}

adapterAddMovieToPlaylist = async (user, playlistName, movieToAdd) => {
    return new Promise((resolve, reject) => {
        updateQuery("Playlists", {
            "username": user,
            "name": playlistName
        }, {
            $push: {
                "movies": movieToAdd
            }
        }, resolve, reject, true)
    });
}

adapterRemoveMovieFromPlaylist = async (user, playlistName, movieToAdd) => {
    return new Promise((resolve, reject) => {
        updateQuery("Playlists", {
            "username": user,
            "name": playlistName
        }, {
            $pull: {
                "movies": movieToAdd
            }
        }, resolve, reject, true)
    });
}

adapterCreatePlaylist = async (user, playlistName) => {
    return new Promise((resolve, reject) => {
        insertQuery("Playlists", {
            "username": user,
            "name": playlistName,
            "movies": []
        }, resolve, reject, true)
    });
}

adapterDeletePlaylist = async (user, playlistName) => {
    return new Promise((resolve, reject) => {
        deleteQuery("Playlists", {
            "username": user,
            "name": playlistName
        }, resolve, reject, true)
    });
}

adapterEditPlaylistName = async (username, oldName, newName) => {
    return new Promise((resolve, reject) => {
        updateQuery("Playlists", {
            "name": oldName,
            "username": username
        },{
            $set:{
                "name": newName,
            }
        }, resolve, reject, true)
    });
}


//#####################################################
// MOVIES
//#####################################################


adapterGetMovieDetails = async (movieId) => {
    return new Promise((resolve, reject) => {
        readQuery("Movies", {
            "imdb_title_id": movieId,
        }, resolve, reject, true)
    });
}


//#####################################################
// RECENSIONI
//#####################################################


adapterGetMovieReviews = async (movieId) => {
    return new Promise((resolve, reject) => {
        readQuery("Reviews", {
            "movieId": movieId,
        }, resolve, reject)
    });
}

adapterCreateReview = async (review) => {
    return new Promise((resolve, reject) => {
        insertQuery("Reviews", review, resolve, reject, true)
    });
}

adapterUpdateReview = async (review) => {
    return new Promise((resolve, reject) => {
        updateQuery("Reviews", {
            "movieId": review.movieId,
            username: review.username
        }, {
            $set: review
        }, resolve, reject, true)
    });
}

adapterDeleteReview = async (username, movieId) => {
    return new Promise((resolve, reject) => {
        deleteQuery("Reviews", {
            "username": username,
            "movieId": movieId
        }, resolve, reject, true)
    });
};

module.exports = {
    readQueryWrapper,
    updateQueryWrapper,
    deleteQueryWrapper,
    insertQueryWrapper
}