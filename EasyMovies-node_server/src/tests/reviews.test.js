const request = require("supertest");
const dbAdapter = require('../libs/dbAdapter');
const testCommons = require('./testCommons');


describe("Test the reviews api", () => {

    let server, agent;

    beforeAll((done)=>{testCommons.testConnect(done).then(r=>{server = r.server; agent = r.agent})});

    afterAll((done) => {testCommons.testClose(done, server)});

    test("200 on get existing movie reviews", async(done) => {
        const response1 = await agent.get("/movies/tt0000009/reviews");
        expect(response1.status).toBe(200);
        done();
    });

    test("404 on get non existing movie reviews", async(done) => {
        const response1 = await agent.get("/movies/not-a-movie/reviews");
        expect(response1.status).toBe(404);
        done();
    });

    test("400 on put movie review without authorization without cookies", async(done) => {
        const response1 = await agent.put("/movies/tt0000009/reviews").send({ username: "aaaa", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(400);
        done();
    });

    test("404 on put movie review on non existing movie", async(done) => {
        const response1 = await agent.put("/movies/not-a-movie/reviews").send({ username: "aaaa", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(404);
        done();
    });

    test("401 on delete movie review without authorization without cookies", async(done) => {
        const response1 = await agent.delete("/movies/tt0000009/reviews").send({ username: "aaaa"});
        expect(response1.status).toBe(401);
        done();
    });

    test("401 on patch movie review without authorization", async(done) => {
        const response1 = await agent.patch("/movies/tt0000009/reviews").send({ username: "aaaa", title: "new-title", content: "different-content", rate: 4 });
        expect(response1.status).toBe(401);
        done();
    });

    test("200 on successful login", async(done) => {
        const response1 = await agent.post("/users/login").send({ username: "aaaa", password: "aaaa" });
        expect(response1.status).toBe(200);
        done();
    });

    test("201 on succesful put movie review", async(done) => {
        const response1 = await agent.put("/movies/tt0000009/reviews").send({ username: "aaaa", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(201);
        done();
    });

    test("400 on put movie review with incorrect request", async(done) => {
        const response1 = await agent.put("/movies/tt0000009/reviews").send({});
        expect(response1.status).toBe(400);
        done();
    });

    test("400 on put movie review with invalid data", async(done) => {
        const response1 = await agent.put("/movies/tt0000009/reviews").send({ username: "aaaa", title: "title", content: "content", rate: -100 });
        expect(response1.status).toBe(400);
        done();
    });

    test("401 on delete movie review without authorization", async(done) => {
        const response1 = await agent.delete("/movies/tt0000009/reviews").send({ username: "aaa"});
        expect(response1.status).toBe(401);
        done();
    });

    test("404 on delete non-existing-movie review", async(done) => {
        //Movie does not exist
        const response1 = await agent.delete("/movies/not-a-movie/reviews").send({ username: "aaaa"});
        expect(response1.status).toBe(404);
        done();
    });

    test("404 on delete non-existing movie-review", async(done) => {
        //Review does not exist
        const response1 = await agent.delete("/movies/tt0000574/reviews").send({ username: "aaaa"});
        expect(response1.status).toBe(404);
        done();
    });

    test("200 on succesful patch movie review", async(done) => {
        const response1 = await agent.patch("/movies/tt0000009/reviews").send({ username: "aaaa", title: "new-title", content: "different-content", rate: 4 });
        expect(response1.status).toBe(200);
        done();
    });

    test("401 on patch movie review without authorization", async(done) => {
        const response1 = await agent.patch("/movies/tt0000009/reviews").send({ username: "aaa", title: "new-title", content: "different-content", rate: 4 });
        expect(response1.status).toBe(401);
        done();
    });

    test("404 on patch non-existing movie-review", async(done) => {
        //Review does not exist
        const response1 = await agent.patch("/movies/tt0000574/reviews").send({ username: "aaaa", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(404);
        done();
    });

    test("404 on patch non-existing-movie review", async(done) => {
        //Movie does not exist
        const response1 = await agent.patch("/movies/not-a-movie/reviews").send({ username: "aaaa", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(404);
        done();
    });
    
    test("200 on successful logout", async(done) => {
        const response = await agent.post("/users/aaaa/logout");
        expect(response.status).toBe(200);
        done();
    });

});