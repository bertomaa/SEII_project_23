const request = require("supertest");
const dbAdapter = require('../libs/dbAdapter');
const testCommons = require('./testCommons');


describe("Test the playlists api", () => {

    let server, agent;

    beforeAll((done)=>{testCommons.testConnect(done).then(r=>{server = r.server; agent = r.agent})});

    afterAll((done) => {testCommons.testClose(done, server)});

    test("404 on get playlists without existing user without cookies", async (done) => {
        const response = await agent.get('/users/not-existing/playlists')
        expect(response.status).toBe(404);
        done()
    });

    test("401 on get playlists with existing user without cookies", async (done) => {
        const response = await agent.get('/users/aaaa/playlists')
        expect(response.status).toBe(401);
        done()
    });

    test("200 on successful login", async(done) => {
        const response1 = await agent.post("/users/login").send({ username: "aaaa", password: "aaaa" });
        expect(response1.status).toBe(200);
        done();
    });

    
    test("201 on create playlists with permissions", async (done) => {
        const response = await agent.put('/users/aaaa/playlists').send({"playlist": "test-playlist"})
        expect(response.status).toBe(201);
        done()
    });

    test("200 on delete playlists with permissions", async (done) => {
        const response = await agent.delete('/users/aaaa/playlists').send({"playlist": "test-playlist"})
        expect(response.status).toBe(200);
        done()
    });
    
    test("200 on successful logout", async(done) => {
        const response = await agent.post("/users/aaaa/logout");
        expect(response.status).toBe(200);
        done();
    });
    // test("404 on get movie data with non-existing movie", async (done) => {
    //     const response = await agent.get("/playlists/fake-movie")
    //     expect(response.status).toBe(404);
    // });
});