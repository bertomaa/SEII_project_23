const dbAdapter = require('./dbAdapter.js')

checkNotNull = (data) => {
    if (!data || data === '')
        return false;
    return true;
}

existsDBField = async (collection, field, value) => {
    let query = {};
    query[field] = value;
    dbAdapter.readQueryWrapper(collection, query, true).then((res) => {
        return res ? true: false;
    }).catch(() => {
        throw new InternalServerErrorException();
    })
}

checkUsername = async (username) => {
    if(!checkNotNull(username))
        return false;
    return await existsDBField('Users', 'username', username);
}


//#####################################################
// EXTRA
//#####################################################

adapterWrapper = async (foo, res, successCode, errorCode) => {
    foo().then(()=>res.status(successCode).send()).catch(()=>res.status(errorCode).send())
};
