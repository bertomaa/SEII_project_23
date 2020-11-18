const dbAdapter = require('./dbAdapter.js')

checkNull = (data) => {
    if (!data || data === '')
        return true;
    return false;
}

checkFieldsNull = (fieldsList) => {
    for(let f of fieldsList){
        if(checkNull(f))
            return true;
    }
    return false;
}

existsDBField = async (collection, field, value) => {
    let query = {};
    query[field] = value;
    let promise =  dbAdapter.readQueryWrapper(collection, query, true).then((res) => {
        return res ? true: false;
    }).catch(() => {
        throw new InternalServerErrorException();
    })
    let res = await promise;
    return res;
}

checkUsername = async (username) => {
    return await existsDBField('Users', 'username', username);
}




//#####################################################
// EXTRA
//#####################################################

adapterWrapper = async (foo, res, successCode, errorCode) => {
    foo().then(()=>res.status(successCode).send()).catch(()=>res.status(errorCode).send())
};

module.exports = {
    checkNull,
    checkFieldsNull,
    existsDBField,
    checkUsername,
    adapterWrapper
}