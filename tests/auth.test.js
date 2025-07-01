/* global describe, it */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";

chai.use(chaiHttp);

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await chai.request(app).post("/api/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@example.com",
      password: "Test1234",
    });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("token");
  });

  it("should login an existing user", async () => {
    const res = await chai.request(app).post("/api/auth/login").send({
      email: "janedoe@example.com",
      password: "Test1234",
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
  });
});
