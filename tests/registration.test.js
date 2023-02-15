import request from "supertest";
import db from "./utils/initDatabase";
import app from "./utils/initTests.js";

beforeAll(async () => await db.connect())

afterEach(async () => await db.clearDatabase())

afterAll(async () => await db.closeDatabase())

describe("POST /auth/register", () => {
  it("WHEN registering with invalid payload THEN expect error", async () => {
    let payload = {
      username: "juniar1",
      email: "juniar.almende.org",
      password: "qwer",
      firstName: "juniar",
      lastName: "rakhman"
    };
    const res = await request(app).post("/api/auth/register").send(payload);
    expect(res.statusCode).toBe(400);
  });
});


describe("POST /auth/register", () => {
  it("WHEN registering with valid payload THEN expect OK status", async () => {
    let payload = {
      username: "juniar1",
      email: "juniar@almende.org",
      password: "qweQWE321#",
      firstName: "juniar",
      lastName: "rakhman"
    };
    const res = await request(app).post("/api/auth/register").send(payload);
    expect(res.statusCode).toBe(201);
    //expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("POST /auth/register", () => {
  it("WHEN registering with valid payload but user already registered THEN expect error", async () => {
    let payload = {
      username: "juniar1",
      email: "juniar@almende.org",
      password: "qweQWE321#",
      firstName: "juniar",
      lastName: "rakhman"
    };
    // send first data
    await request(app).post("/api/auth/register").send(payload);
    // send data again
    const res = await request(app).post("/api/auth/register").send(payload);
    expect(res.statusCode).toBe(400);
  });
});
