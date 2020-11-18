const request = require("supertest");
const app = require("../app");
const dbAdapter = require('../libs/dbAdapter');


describe("Test the movies api", () => {

    let server, agent;

    let cookies;

    beforeAll(async (done) => {
        const port = process.env.PORT || 5000;
        return new Promise(async (resolve, reject) => {
            await dbAdapter.initDB().catch((e) => reject(e));
            server = app.listen(port, () => {
                console.log(`DB connected and server listening on port ${port}`);
                agent = request.agent(server);
                done();
            });
        });
    });

    afterAll((done) => {
        server.close(() => {
            dbAdapter.closeDB().then(() => { console.log("Server and DB connection closed"); done(); })
        });
    });

    test("200 on get movie data with existing movie", () => {
        agent.get("/movies/tt0000009").expect(200);
    });

    test("404 on get movie data with non-existing movie", () => {
        agent.get("/movies/fake-movie").expect(404);
    });
});