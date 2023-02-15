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
  it("WHEN logging in with correct username THEN expect access and refresh token", async () => {
    let payload = {
      username: "juniar1",
      password: "qweQWE321#",
    };
    const res = await request(app).post("/api/auth/login").send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.refreshToken).not.toBeNull
  });
});

describe("POST /auth/login", () => {
  it("WHEN logging in with correct email AND session exists THEN expect session already exists error", async () => {
    let payload = {
      email: "juniar@almende.org",
      password: "qweQWE321#",
    };
    const res = await request(app).post("/api/auth/login").send(payload);
    expect(res.statusCode).toBe(401);
  });
});
