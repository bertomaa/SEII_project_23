const request = require("supertest");
const dbAdapter = require('../libs/dbAdapter');
const testCommons = require('./testCommons')


describe("Test the users api", () => {

    let server, agent;

    let cookies;

    beforeAll((done)=>{testCommons.testConnect(done).then(r=>{server = r.server; agent = r.agent})});

    afterAll((done) => {testCommons.testClose(done, server)});

    test("200 on get user data with existing user", async (done) => {
        const response = await agent.get('/users/aaaa')
        expect(response.status).toBe(200);
        done()
    });

    test("404 on get user data with non-existing user", async (done) => {
         const response = await agent.get("/users/fake-user");
         expect(response.status).toBe(404);
         done();
    });

    test("400 on log out without logging in", async (done) => {
         const response = await agent.get("/users/aaaa/logout");
         expect(response.status).toBe(400);
         done();
    });

    test("200 on successful login", async (done) => {
        const response = agent.post("/users/aaaa").set({username: "aaaa", password: "aaaa"});
        expect(response.status).toBe(200);
        cookies = res.cookies;
        done();
    });

    test("200 on successful logout", async (done) => {
         const response = await agent.post("/users/aaaa/logout").set("Cookie", cookies);
         expect(response.status).toBe(200);
         done();
    });

    test("201 on successful user creation", async (done) => {
         const response = await agent.post("/users/register").set({
            name: "new-user-name",
            password: "new-user-password",
            surname: "new-user-surname",
            username: "new-user-username"
        });
        expect(response.status).toBe(201);
        done();
    });

    test("409 on duplicate user creation", async (done) => {
         const response = await agent.post("/users/register").set({
            name: "new-user-name",
            password: "new-user-password",
            surname: "new-user-surname",
            username: "new-user-username"
        });
        expect(response.status).toBe(409);
        done();
    });

});