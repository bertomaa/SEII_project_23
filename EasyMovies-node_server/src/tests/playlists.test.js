const request = require("supertest");
const dbAdapter = require('../libs/dbAdapter');
const testCommons = require('./testCommons');


describe("Test the playlists api V1", () => {

    let server, agent;

    beforeAll((done) => {
        testCommons.testConnect(done).then( async r => {
            server = r.server; agent = r.agent;
            try {
                await agent.post("/api/v1/users/register").send({
                    name: "test-user",
                    password: "test-user-password",
                    surname: "test-user-surname",
                    username: "test-user"
                });
            } catch (e) {
                //Do nothing
            }
            try {
                await agent.post("/api/v1/users/register").send({
                    name: "second-test-user",
                    password: "second-test-user-password",
                    surname: "second-test-user-surname",
                    username: "second-test-user"
                });
            } catch (e) {
                //Do nothing
            }
            done();
        });

    });

    afterAll((done) => { testCommons.testClose(done, server) });

    test("404 on get playlists without existing user without cookies", async (done) => {
        const response = await agent.get('/api/v1/users/not-a-user/playlists');
        expect(response.status).toBe(404);
        done();
    });

    test("401 on get playlists with existing user without cookies", async (done) => {
        const response = await agent.get('/api/v1/users/test-user/playlists');
        expect(response.status).toBe(401);
        done();
    });

    test("401 on create playlists without permissions without cookies", async (done) => {
        const response = await agent.put('/api/v1/users/test-user/playlists').send({ "playlist": "test-playlist" });
        expect(response.status).toBe(401);
        done();
    });

    test("401 on edit playlist name without permission without cookies", async (done) => {
        const response = await agent.patch('/api/v1/users/test-user/playlists/test-playlist').send({ "newName": "new-name" });
        expect(response.status).toBe(401);
        done();
    });

    test("200 on successful login", async (done) => {
        const response = await agent.post("/api/v1/users/login").send({ username: "test-user", password: "test-user-password" });
        expect(response.status).toBe(200);
        done();
    });

    test("200 on get playlists with permissions", async (done) => {
        const response = await agent.get('/api/v1/users/test-user/playlists');
        expect(response.status).toBe(200);
        done();
    });

    test("201 on create playlists with permissions", async (done) => {
        const response = await agent.put('/api/v1/users/test-user/playlists').send({ "playlist": "test-playlist" });
        expect(response.status).toBe(201);
        done();
    });

    test("401 on create playlists without permissions", async (done) => {
        const response = await agent.put('/api/v1/users/second-test-user/playlists').send({ "playlist": "test-playlist" });
        expect(response.status).toBe(401);
        done();
    });

    test("404 on create playlists with non existing user", async (done) => {
        const response = await agent.put('/api/v1/users/not-a-user/playlists').send({ "playlist": "test-playlist" });
        expect(response.status).toBe(404);
        done();
    });

    test("200 on add movie to playlist", async (done) => {
        const response = await agent.put('/api/v1/users/test-user/playlists/test-playlist').send({ "movieId": "tt0000009" });
        expect(response.status).toBe(200);
        done();
    });

    test("400 on add movie to playlist without correct data", async (done) => {
        const response = await agent.put('/api/v1/users/test-user/playlists/test-playlist').send({});
        expect(response.status).toBe(400);
        done();
    });

    test("401 on add movie to playlist without permission", async (done) => {
        const response = await agent.put('/api/v1/users/second-test-user/playlists/test-playlist').send({ "movieId": "tt0000009" });
        expect(response.status).toBe(401);
        done();
    });

    test("404 on add movie to non existing playlist", async (done) => {
        const response = await agent.put('/api/v1/users/test-user/playlists/not-a-playlist').send({ "movieId": "tt0000009" });
        expect(response.status).toBe(404);
        done();
    });

    test("404 on add movie to non existing playlist of non existing user", async (done) => {
        const response = await agent.put('/api/v1/users/not-a-user/playlists/not-a-playlist').send({ "movieId": "tt0000009" });
        expect(response.status).toBe(404);
        done();
    });

    test("200 on edit playlist name", async (done) => {
        const response = await agent.patch('/api/v1/users/test-user/playlists/test-playlist').send({ "newName": "new-name" });
        expect(response.status).toBe(200);
        done();
    });

    test("404 on edit non-existing playlist name", async (done) => {
        const response = await agent.patch('/api/v1/users/test-user/playlists/not-a-playlist').send({ "newName": "new-name" });
        expect(response.status).toBe(404);
        done();
    });

    test("404 on edit non-existing user and non existing playlist", async (done) => {
        const response = await agent.patch('/api/v1/users/not-a-user/playlists/not-a-playlist').send({ "newName": "new-name" });
        expect(response.status).toBe(404);
        done();
    });

    test("401 on edit playlist name without permission", async (done) => {
        const response = await agent.patch('/api/v1/users/second-test-user/playlists/not-a-playlist').send({ "newName": "new-name" });
        expect(response.status).toBe(401);
        done();
    });

    test("200 on delete movie from playlist", async (done) => {
        const response1 = await agent.put('/api/v1/users/test-user/playlists/new-name').send({ "movieId": "tt0000009" });
        const response2 = await agent.delete('/api/v1/users/test-user/playlists/new-name').send({ "movieId": "tt0000009" });
        expect(response2.status).toBe(200);
        done();
    });

    test("404 on delete movie from non existing playlist", async (done) => {
        const response = await agent.delete('/api/v1/users/test-user/playlists/not-a-playlist').send({ "movieId": "tt0000009" });
        expect(response.status).toBe(404);
        done();
    });

    test("404 on delete non existing movie from playlist", async (done) => {
        const response = await agent.delete('/api/v1/users/test-user/playlists/test-playlist').send({ "movieId": "not a movieId" });
        expect(response.status).toBe(404);
        done();
    });

    test("400 on delete movie from playlist without correct data", async (done) => {
        const response = await agent.delete('/api/v1/users/test-user/playlists/new-name').send({});
        expect(response.status).toBe(400);
        done();
    });

    test("401 on delete movie from playlist without permission", async (done) => {
        const response = await agent.delete('/api/v1/users/second-test-user/playlists/test-playlist').send({ "movieId": "tt0000009" });
        expect(response.status).toBe(401);
        done();
    });

    test("200 on delete playlists with permissions", async (done) => {
        const response = await agent.delete('/api/v1/users/test-user/playlists').send({ "playlist": "new-name" });
        expect(response.status).toBe(200);
        done();
    });

    test("401 on delete playlists without permissions", async (done) => {
        const response = await agent.delete('/api/v1/users/second-test-user/playlists').send({ "playlist": "test-playlist" });
        expect(response.status).toBe(401);
        done();
    });

    test("404 on delete non existing playlist", async (done) => {
        const response = await agent.delete('/api/v1/users/test-user/playlists').send({ "playlist": "not-a-playlist" });
        expect(response.status).toBe(404);
        done();
    });

    test("200 on successful logout", async (done) => {
        const response = await agent.post("/api/v1/users/test-user/logout");
        expect(response.status).toBe(200);
        done();
    });
    // test("404 on get movie data with non-existing movie", async (done) => {
    //     const response = await agent.get("/playlists/fake-movie")
    //     expect(response.status).toBe(404);
    // });
});