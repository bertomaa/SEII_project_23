const request = require("supertest");
const dbAdapter = require('../libs/dbAdapter');
const testCommons = require('./testCommons');


describe("Test the reviews api V1", () => {

    let server, agent;

    beforeAll((done)=>{
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

    afterAll((done) => {testCommons.testClose(done, server)});

    test("200 on get existing movie reviews", async(done) => {
        const response1 = await agent.get("/api/v1/movies/tt0000009/reviews");
        expect(response1.status).toBe(200);
        done();
    });

    test("404 on get non existing movie reviews", async(done) => {
        const response1 = await agent.get("/api/v1/movies/not-a-movie/reviews");
        expect(response1.status).toBe(404);
        done();
    });

    test("401 on put movie review without authorization without cookies", async(done) => {
        const response1 = await agent.put("/api/v1/movies/tt0000009/reviews").send({ username: "test-user", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(401);
        done();
    });

    test("401 on delete movie review without authorization without cookies", async(done) => {
        const response1 = await agent.delete("/api/v1/movies/tt0000009/reviews").send({ username: "test-user"});
        expect(response1.status).toBe(401);
        done();
    });

    test("401 on patch movie review without authorization", async(done) => {
        const response1 = await agent.patch("/api/v1/movies/tt0000009/reviews").send({ username: "test-user", title: "new-title", content: "different-content", rate: 4 });
        expect(response1.status).toBe(401);
        done();
    });

    test("200 on successful login", async(done) => {
        const response1 = await agent.post("/api/v1/users/login").send({ username: "test-user", password: "test-user-password" });
        expect(response1.status).toBe(200);
        done();
    });

    test("201 on succesful put movie review", async(done) => {
        const response1 = await agent.put("/api/v1/movies/tt0000009/reviews").send({ username: "test-user", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(201);
        done();
    });

    test("400 on put movie review with incorrect request", async(done) => {
        const response1 = await agent.put("/api/v1/movies/tt0000009/reviews").send({});
        expect(response1.status).toBe(400);
        done();
    });

    test("400 on put movie review with invalid data", async(done) => {
        const response1 = await agent.put("/api/v1/movies/tt0000009/reviews").send({ username: "test-user", title: "title", content: "content", rate: -100 });
        expect(response1.status).toBe(400);
        done();
    });

    test("404 on put movie review on non existing movie", async(done) => {
        const response1 = await agent.put("/api/v1/movies/not-a-movie/reviews").send({ username: "test-user", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(404);
        done();
    });

    test("200 on succesful patch movie review", async(done) => {
        const response1 = await agent.patch("/api/v1/movies/tt0000009/reviews").send({ username: "test-user", title: "new-title", content: "different-content", rate: 4 });
        expect(response1.status).toBe(200);
        done();
    });

    test("401 on patch movie review without authorization", async(done) => {
        const response1 = await agent.patch("/api/v1/movies/tt0000009/reviews").send({ username: "second-test-user", title: "new-title", content: "different-content", rate: 4 });
        expect(response1.status).toBe(401);
        done();
    });

    test("404 on patch non-existing movie-review", async(done) => {
        //Review does not exist
        const response1 = await agent.patch("/api/v1/movies/tt0000574/reviews").send({ username: "test-user", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(404);
        done();
    });

    test("404 on patch non-existing-movie review", async(done) => {
        //Movie does not exist
        const response1 = await agent.patch("/api/v1/movies/not-a-movie/reviews").send({ username: "test-user", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(404);
        done();
    });

    test("200 on succesful delete movie review", async(done) => {
        const response1 = await agent.delete("/api/v1/movies/tt0000009/reviews").send({ username: "test-user"});
        expect(response1.status).toBe(200);
        done();
    });

    test("401 on delete movie review without authorization", async(done) => {
        const response1 = await agent.delete("/api/v1/movies/tt0000009/reviews").send({ username: "second-test-user"});
        expect(response1.status).toBe(401);
        done();
    });

    test("404 on delete non-existing-movie review", async(done) => {
        //Movie does not exist
        const response1 = await agent.delete("/api/v1/movies/not-a-movie/reviews").send({ username: "test-user"});
        expect(response1.status).toBe(404);
        done();
    });

    test("404 on delete non-existing movie-review", async(done) => {
        //Review does not exist
        const response1 = await agent.delete("/api/v1/movies/tt0000574/reviews").send({ username: "test-user"});
        expect(response1.status).toBe(404);
        done();
    });
    
    test("200 on successful logout", async(done) => {
        const response = await agent.post("/api/v1/users/test-user/logout");
        expect(response.status).toBe(200);
        done();
    });

});

describe("Test the reviews api V2", () => {

    let server, agent;

    beforeAll((done)=>{
        testCommons.testConnect(done).then( async r => {
            server = r.server; agent = r.agent;
            try {
                await agent.post("/api/v2/users/register").send({
                    name: "test-user",
                    password: "test-user-password",
                    surname: "test-user-surname",
                    username: "test-user"
                });
            } catch (e) {
                //Do nothing
            }
            try {
                await agent.post("/api/v2/users/register").send({
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

    afterAll((done) => {testCommons.testClose(done, server)});

    test("200 on get existing movie reviews", async(done) => {
        const response1 = await agent.get("/api/v2/movies/tt0000009/reviews");
        expect(response1.status).toBe(200);
        done();
    });

    test("404 on get non existing movie reviews", async(done) => {
        const response1 = await agent.get("/api/v2/movies/not-a-movie/reviews");
        expect(response1.status).toBe(404);
        done();
    });

    test("401 on put movie review without authorization without cookies", async(done) => {
        const response1 = await agent.put("/api/v2/movies/tt0000009/reviews").send({ username: "test-user", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(401);
        done();
    });

    test("401 on delete movie review without authorization without cookies", async(done) => {
        const response1 = await agent.delete("/api/v2/movies/tt0000009/reviews").send({ username: "test-user"});
        expect(response1.status).toBe(401);
        done();
    });

    test("401 on patch movie review without authorization", async(done) => {
        const response1 = await agent.patch("/api/v2/movies/tt0000009/reviews").send({ username: "test-user", title: "new-title", content: "different-content", rate: 4 });
        expect(response1.status).toBe(401);
        done();
    });

    test("200 on successful login", async(done) => {
        const response1 = await agent.post("/api/v2/users/login").send({ username: "test-user", password: "test-user-password" });
        expect(response1.status).toBe(200);
        done();
    });

    test("201 on succesful put movie review", async(done) => {
        const response1 = await agent.put("/api/v2/movies/tt0000009/reviews").send({ username: "test-user", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(201);
        done();
    });

    test("400 on put movie review with incorrect request", async(done) => {
        const response1 = await agent.put("/api/v2/movies/tt0000009/reviews").send({});
        expect(response1.status).toBe(400);
        done();
    });

    test("400 on put movie review with invalid data", async(done) => {
        const response1 = await agent.put("/api/v2/movies/tt0000009/reviews").send({ username: "test-user", title: "title", content: "content", rate: -100 });
        expect(response1.status).toBe(400);
        done();
    });

    test("404 on put movie review on non existing movie", async(done) => {
        const response1 = await agent.put("/api/v2/movies/not-a-movie/reviews").send({ username: "test-user", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(404);
        done();
    });

    test("200 on succesful patch movie review", async(done) => {
        const response1 = await agent.patch("/api/v2/movies/tt0000009/reviews").send({ username: "test-user", title: "new-title", content: "different-content", rate: 4 });
        expect(response1.status).toBe(200);
        done();
    });

    test("401 on patch movie review without authorization", async(done) => {
        const response1 = await agent.patch("/api/v2/movies/tt0000009/reviews").send({ username: "second-test-user", title: "new-title", content: "different-content", rate: 4 });
        expect(response1.status).toBe(401);
        done();
    });

    test("404 on patch non-existing movie-review", async(done) => {
        //Review does not exist
        const response1 = await agent.patch("/api/v2/movies/tt0000574/reviews").send({ username: "test-user", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(404);
        done();
    });

    test("404 on patch non-existing-movie review", async(done) => {
        //Movie does not exist
        const response1 = await agent.patch("/api/v2/movies/not-a-movie/reviews").send({ username: "test-user", title: "title", content: "content", rate: 5 });
        expect(response1.status).toBe(404);
        done();
    });

    test("200 on succesful delete movie review", async(done) => {
        const response1 = await agent.delete("/api/v2/movies/tt0000009/reviews").send({ username: "test-user"});
        expect(response1.status).toBe(200);
        done();
    });

    test("401 on delete movie review without authorization", async(done) => {
        const response1 = await agent.delete("/api/v2/movies/tt0000009/reviews").send({ username: "second-test-user"});
        expect(response1.status).toBe(401);
        done();
    });

    test("404 on delete non-existing-movie review", async(done) => {
        //Movie does not exist
        const response1 = await agent.delete("/api/v2/movies/not-a-movie/reviews").send({ username: "test-user"});
        expect(response1.status).toBe(404);
        done();
    });

    test("404 on delete non-existing movie-review", async(done) => {
        //Review does not exist
        const response1 = await agent.delete("/api/v2/movies/tt0000574/reviews").send({ username: "test-user"});
        expect(response1.status).toBe(404);
        done();
    });
    
    test("200 on successful logout", async(done) => {
        const response = await agent.post("/api/v2/users/test-user/logout");
        expect(response.status).toBe(200);
        done();
    });

});