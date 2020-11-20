const request = require("supertest");
const dbAdapter = require('../libs/dbAdapter');
const testCommons = require('./testCommons')


describe("Test the users api", () => {

    let server, agent;

    beforeAll((done) => {
        testCommons.testConnect(done).then(r => {
            server = r.server;
            agent = r.agent
        })
    });

    afterAll((done) => { testCommons.testClose(done, server) });

    //GET /users/username

    test("200 on get user data with existing user", async(done) => {
        const response = await agent.get('/users/aaaa');
        expect(response.status).toBe(200);
        done()
    });
    
    test("404 on get user data with non-existing user", async(done) => {
        const response = await agent.get("/users/fake-user");
        expect(response.status).toBe(404);
        done();
    });

    //POST /users/login

    test("400 on login with no password", async(done) => {
        const response1 = await agent.post("/users/login").send({ username: "aaaa"});
        expect(response1.status).toBe(400);
        done();
    });

    test("401 on login with non-existing username", async(done) => {
        const response1 = await agent.post("/users/login").send({ username: "bbbb", password: "bbbb" });
        expect(response1.status).toBe(401);
        done();
    });

    test("401 on login with wrong password", async(done) => {
        const response1 = await agent.post("/users/login").send({ username: "aaaa", password: "bbbb" });
        expect(response1.status).toBe(401);
        done();
    });

    test("200 on successful login", async(done) => {
        const response1 = await agent.post("/users/login").send({ username: "aaaa", password: "aaaa" });
        expect(response1.status).toBe(200);
        done();
    });

    //POST /users/logout

    test("404 on log out with wrong username", async(done) => {
        const response = await agent.post("/users/bbbb/logout");
        expect(response.status).toBe(404);
        done();
    });
    
    test("200 on successful logout", async(done) => {
        const response = await agent.post("/users/aaaa/logout");
        expect(response.status).toBe(200);
        done();
    });

    test("400 on log out without logging in", async(done) => {
        const response = await agent.post("/users/aaaa/logout");
        expect(response.status).toBe(400);
        done();
    });

    //POST /users/register

    test("201 on successful user creation", async(done) => {
        const response = await agent.post("/users/register").send({
            name: "test-user-name",
            password: "test-user-password",
            surname: "test-user-surname",
            username: "test-user-username"
        });
        expect(response.status).toBe(201);
        done();
    });

    test("400 on user creation with incorrect body", async(done) => {
        const response = await agent.post("/users/register").send({
            name: "test-user-name",
            password: "test-user-password",
            surname: "test-user-surname",
        });
        expect(response.status).toBe(400);
        done();
    });

    test("409 on duplicate user creation", async(done) => {
        const response = await agent.post("/users/register").send({
            name: "test-user-name",
            password: "testuser-password",
            surname: "test-user-surname",
            username: "test-user-username"
        });
        expect(response.status).toBe(409);
        done();
    });

    //GET /users/username/reviews

    test("200 on successful user reviews get", async(done) => {
        const response = await agent.get("/users/aaaa/reviews");
        expect(response.status).toBe(200);
        done();
    });

    test("404 on user reviews get with wrong user", async(done) => {
        const response = await agent.get("/users/bbbb/reviews");
        expect(response.status).toBe(404);
        done();
    });

});