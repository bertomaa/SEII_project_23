const request = require("supertest");
const dbAdapter = require('../libs/dbAdapter');
const testCommons = require('./testCommons');


describe("Test the playlists api", () => {

    let server, agent;

    beforeAll((done)=>{testCommons.testConnect(done).then(r=>{server = r.server; agent = r.agent})});

    afterAll((done) => {testCommons.testClose(done, server)});

    test("404 on get playlists without existing user without cookies", async (done) => {
        const response = await agent.get('/users/not-existing/playlists');
        expect(response.status).toBe(404);
        done();
    });

    test("401 on get playlists with existing user without cookies", async (done) => {
        const response = await agent.get('/users/aaaa/playlists');
        expect(response.status).toBe(401);
        done();
    });

    test("401 on create playlists without permissions without cookies", async (done) => {
        const response = await agent.put('/users/aaaa/playlists').send({"playlist": "test-playlist"});
        expect(response.status).toBe(401);
        done();
    });

    test("401 on edit playlist name without permission without cookies", async (done) => {
        const response = await agent.patch('/users/aaaa/playlists/test-playlist').send({"newName": "new-name"});
        expect(response.status).toBe(401);
        done();
    });

    test("200 on successful login", async(done) => {
        const response = await agent.post("/users/login").send({ username: "aaaa", password: "aaaa" });
        expect(response.status).toBe(200);
        done();
    });

    test("200 on get playlists with permissions", async (done) => {
        const response = await agent.get('/users/aaaa/playlists');
        expect(response.status).toBe(200);
        done();
    });
    
    test("201 on create playlists with permissions", async (done) => {
        const response = await agent.put('/users/aaaa/playlists').send({"playlist": "test-playlist"});
        expect(response.status).toBe(201);
        done()
    });

    test("401 on create playlists without permissions", async (done) => {
        const response = await agent.put('/users/aaa/playlists').send({"playlist": "test-playlist"});
        expect(response.status).toBe(401);
        done();
    });

    test("404 on create playlists with non existing user", async (done) => {
        const response = await agent.put('/users/not-a-user/playlists').send({"playlist": "test-playlist"});
        expect(response.status).toBe(404);
        done();
    });

    test("200 on delete playlists with permissions", async (done) => {
        const response = await agent.delete('/users/aaaa/playlists').send({"playlist": "test-playlist"});
        expect(response.status).toBe(200);
        done();
    });

    test("401 on delete playlists without permissions", async (done) => {
        const response = await agent.delete('/users/aaa/playlists').send({"playlist": "test-playlist"});
        expect(response.status).toBe(401);
        done();
    });

    test("404 on delete non existing playlist", async (done) => {
        const response = await agent.delete('/users/aaaa/playlists').send({"playlist": "not-a-playlist"});
        expect(response.status).toBe(404);
        done();
    });

    test("200 on add movie to playlist", async (done) => {
        const response = await agent.put('/users/aaaa/playlists/test-playlist').send({"movieId": "tt0000009"});
        expect(response.status).toBe(200);
        done();
    });

    test("400 on add movie to playlist without correct data", async (done) => {
        const response = await agent.put('/users/aaaa/playlists/test-playlist').send({});
        expect(response.status).toBe(400);
        done();
    });

    test("401 on add movie to playlist without permission", async (done) => {
        const response = await agent.put('/users/aaa/playlists/test-playlist').send({"movieId": "tt0000009"});
        expect(response.status).toBe(401);
        done();
    });

    test("404 on add movie to non existing playlist", async (done) => {
        const response = await agent.put('/users/aaaa/playlists/not-a-playlist').send({"movieId": "tt0000009"});
        expect(response.status).toBe(404);
        done();
    });

    test("404 on add movie to non existing playlist of non existing user", async (done) => {
        const response = await agent.put('/users/not-a-user/playlists/not-a-playlist').send({"movieId": "tt0000009"});
        expect(response.status).toBe(404);
        done();
    });

    test("200 on edit playlist name", async (done) => {
        const response = await agent.patch('/users/aaaa/playlists/test-playlist').send({"newName": "new-name"});
        expect(response.status).toBe(200);
        done();
    });

    test("404 on edit non-existing playlist name", async (done) => {
        const response = await agent.patch('/users/aaaa/playlists/not-a-playlist').send({"newName": "new-name"});
        expect(response.status).toBe(404);
        done();
    });

    test("404 on edit non-existing user and non existing playlist", async (done) => {
        const response = await agent.patch('/users/not-a-user/playlists/not-a-playlist').send({"newName": "new-name"});
        expect(response.status).toBe(404);
        done();
    });

    test("401 on edit playlist name without permission", async (done) => {
        const response = await agent.patch('/users/aaa/playlists/not-a-playlist').send({"newName": "new-name"});
        expect(response.status).toBe(401);
        done();
    });

    test("200 on delete movie from playlist", async (done) => {
        const response1 = await agent.put('/users/aaaa/playlists/new-name').send({"movieId": "tt0000009"});
        const response2 = await agent.delete('/users/aaaa/playlists/new-name').send({"movieId": "tt0000009"});
        expect(response2.status).toBe(200);
        done();
    });

    test("404 on delete movie from non existing playlist", async (done) => {
        const response = await agent.delete('/users/aaaa/playlists/not-a-playlist').send({"movieId": "tt0000009"});
        expect(response.status).toBe(404);
        done();
    });

    test("404 on delete non existing movie from playlist", async (done) => {
        const response = await agent.delete('/users/aaaa/playlists/test-playlist').send({"movieId": "not a movieId"});
        expect(response.status).toBe(404);
        done();
    });

    test("400 on delete movie from playlist without correct data", async (done) => {
        const response = await agent.delete('/users/aaaa/playlists/new-name').send({});
        expect(response.status).toBe(400);
        done();
    });

    test("401 on delete movie from playlist without permission", async (done) => {
        const response = await agent.delete('/users/aaa/playlists/test-playlist').send({"movieId": "tt0000009"});
        expect(response.status).toBe(401);
        done();
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