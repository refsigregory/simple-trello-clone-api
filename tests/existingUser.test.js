import request from "supertest";
import db from "./utils/initDatabase";
import app from "./utils/initTests.js";

beforeAll(async () => {  
  await db.connect()

  // create new valid user
  let payload = {
    username: "juniar1",
    email: "juniar@almende.org",
    password: "qweQWE321#",
    firstName: "juniar",
    lastName: "rakhman"
  };
  await request(app).post("/api/auth/register").send(payload);
})

afterAll(async () => {
  await db.clearDatabase()
  await db.closeDatabase()
});


describe("POST /auth/login", () => {
  it("WHEN re-login with invalid password THEN expect invalid password error", async () => {
    let payload = {
      username: "juniar@almende.org",
      password: "qwdsfa123",
    };
    const res = await request(app).post("/api/auth/login").send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /auth/login", () => {
  it("WHEN re-login with valid password THEN expect new token pair", async () => {
    let payload = {
      email: "juniar@almende.org",
      password: "qweQWE321#",
    };
    const res = await request(app).post("/api/auth/login").send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.refreshToken).not.toBeNull;
    expect(res.body.data.accessToken).not.toBeNull;
  });
});
