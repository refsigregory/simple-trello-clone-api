import request from "supertest";
import db from "./utils/initDatabase";
import app from "./utils/initTests.js";
import oldAuthData from "./mock/oldAuthData";

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
})

describe("GET /auth/refresh", () => {
  it("WHEN refreshing with valid token THEN expect new token pair", async () => {
    let payload = {
      username: "juniar1",
      password: "qweQWE321#",
    };

    // login
    const userData = await request(app).post("/api/auth/login").send(payload);

    // refresh token
    const res = await request(app).get(`/api/auth/refresh?refreshToken=${userData._body.data.refreshToken}`).send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.accessToken).not.toBeNull;
  });
});

describe("GET /auth/refresh", () => {
  it("WHEN refreshing with invalid session id THEN expect TokenInvalidatedException", async () => {
      const res = await request(app).get(`/api/auth/refresh?refreshToken=asd`);
      
      expect(res.statusCode).toBe(400);
  });
});

describe("GET /auth/refresh", () => {
  it("WHEN refreshing with old refresh token THEN expect SessionNotFoundException", async () => {
    const res = await request(app).get(`/api/auth/refresh?refreshToken=${oldAuthData.refreshToken}`);

    expect(res.statusCode).toBe(400);
  });
});
