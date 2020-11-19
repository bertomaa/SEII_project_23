const request = require("supertest");
const dbAdapter = require('../libs/dbAdapter');
const testCommons = require('./testCommons');


describe("Test the movies api", () => {

    let server, agent;

    let cookies;

    beforeAll((done)=>{testCommons.testConnect(done).then(r=>{server = r.server; agent = r.agent})});

    afterAll((done) => {testCommons.testClose(done, server)});

    test("200 on get movie data with existing movie", async (done) => {
        const response = await agent.get('/movies/tt0000009');
        expect(response.status).toBe(200);
        done();
    });

    test("404 on get movie data with non-existing movie", async (done) => {
        const response = await agent.get("/movies/fake-movie");
        expect(response.status).toBe(404);
        done();
    });
});