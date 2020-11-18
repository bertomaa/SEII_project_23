const request = require("supertest");
const app = require("../app");
const dbAdapter = require('../libs/dbAdapter');


describe("Test the users api", () => {

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

    test("200 on get user data with existing user", () => {
        agent.get("/users/aaaa").expect(200);
    });

    test("404 on get user data with non-existing user", () => {
        agent.get("/users/fake-user").expect(404);
    });

    test("400 on log out without logging in", () => {
        agent.get("/users/aaaa/logout").expect(400);
    });

    test("200 on successful login", () => {
        let res = agent.post("/users/aaaa").set({username: "aaaa", password: "aaaa"}).expect(200);
        cookies = res.cookies;
    });

    test("200 on successful logout", () => {
        agent.post("/users/aaaa/logout").set("Cookie", cookies).expect(200);
    });

    test("201 on successful user creation", () => {
        agent.post("/users/register").set({
            name: "new-user-name",
            password: "new-user-password",
            surname: "new-user-surname",
            username: "new-user-username"
        }).expect(201);
    });

    test("409 on duplicate user creation", () => {
        agent.post("/users/register").set({
            name: "new-user-name",
            password: "new-user-password",
            surname: "new-user-surname",
            username: "new-user-username"
        }).expect(409);
    });

});