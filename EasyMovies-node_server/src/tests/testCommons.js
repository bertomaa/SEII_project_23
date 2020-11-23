const request = require("supertest");
const {app,routerApiV1} = require("../app");
const dbAdapter = require('../libs/dbAdapter');

const testConnect = async(done) => {
    const port = process.env.PORT || 5000;
    let server, agent;
    return new Promise(async(resolve, reject) => {
        await dbAdapter.initDB().catch((e) => reject(e));
        server = app.listen(port, () => {
            console.log(`DB connected and server listening on port ${port}`);
            agent = request.agent(server);
            done();
            resolve({
                "agent": agent,
                "server": server
            })
        });
    });
}

const testClose = async(done, server) => {
    server.close(() => {
        dbAdapter.closeDB().then(() => {
            console.log("Server and DB connection closed");
            done();
        })
    });
}

module.exports = {
    testConnect,
    testClose,
}