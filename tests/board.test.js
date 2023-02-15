import request from "supertest";
import db from "./utils/initDatabase";
import app from "./utils/initTests.js";
import initAuth from "./utils/intAuth";

let authData = {};

beforeAll(async () => {  
  await db.connect()
  authData = await initAuth(app);
})

afterAll(async () => {
  await db.clearDatabase()
  await db.closeDatabase()
});

describe("POST /api/board", () => {
  it("WHEN creating new board with valid payload THEN expect ok status", async () => {
    let payload = {
      name: "foo",
      description: "foo",
    };
    const res = await request(app).post("/api/board").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(201);
  });
});


describe("POST /api/board", () => {
  it("WHEN creating new board with invalid payload THEN expect error", async () => {
    let payload = {
      bar: "foo",
    };
    const res = await request(app).post("/api/board").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/board", () => {
  it("WHEN creating new board with empty payload THEN expect error", async () => {
    let payload = {
      name: "",
      description: "foo",
    };
    const res = await request(app).post("/api/board").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /api/board", () => {
  it("WHEN fetching existing board THEN expect correct result", async () => {
    const res = await request(app).get("/api/board?name=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`);
    expect(res.statusCode).toBe(200);
  });
});

describe("GET /api/board", () => {
  it("WHEN fetching specific board THEN expect correct result", async () => {
    // add anoter
    let payload = {
      name: "bar",
      description: "foo",
    };
    await request(app).post("/api/board").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    
    // start test
    const res = await request(app).get("/api/board?name=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data?.name).toBe("foo");
  });
});

describe("GET /api/board", () => {
  it("WHEN fetching non-existing board THEN expect error", async () => {
    const res = await request(app).get("/api/board?name=qwe").set('Authorization', `Bearer ${authData.data?.accessToken}`);
    expect(res.statusCode).toBe(400);
  });
});

// Board Update

describe("PUT /api/board", () => {
  it("WHEN creating update board with valid payload THEN expect ok status", async () => {
    let payload = {
      name: "foo",
      description: "bar",
    };
    // Update Data
    const res = await request(app).put("/api/board?name=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(201);
  });
});

describe("PUT /api/board", () => {
  it("WHEN creating update board with invalid payload THEN expect error", async () => {
    let payload = {
      name: "",
    };
    const res = await request(app).put("/api/board?name=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /api/board", () => {
  it("WHEN board already updated THEN expect result already changed", async () => {

    const res = await request(app).get("/api/board?name=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data?.description).toBe("bar");
  });
});

describe("PUT /api/board", () => {
  it("WHEN creating update board with non-existing board THEN expect error", async () => {
    let payload = {
      name: "foo",
      description: "bar",
    };
    // Update Data
    const res = await request(app).put("/api/board?name=zxc").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

// Board Share

describe("POST /api/board/share", () => {
  it("WHEN share board with valid payload THEN expect ok status", async () => {

  // create new valid user
  await request(app).post("/api/auth/register").send({
    username: "juniar2",
    email: "juniar2@almende.org",
    password: "qweQWE321#",
    firstName: "juniar2",
    lastName: "rakhman"
  });

    let payload = {
      username: "juniar2",
      role: "guest",
    };
    // Update Data
    const res = await request(app).post("/api/board/share?name=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(201);
  });
});

describe("POST /api/board/share", () => {
  it("WHEN share board with existin user in board THEN expect error", async () => {

    let payload = {
      username: "juniar2",
      role: "guest",
    };
    // Update Data
    const res = await request(app).post("/api/board/share?name=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/board/share", () => {
  it("WHEN share board with non-existing user THEN expect error", async () => {

    let payload = {
      username: "juniar3",
      role: "guest",
    };
    // Update Data
    const res = await request(app).post("/api/board/share?name=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/board/share", () => {
  it("WHEN share board with invalid payload THEN expect error", async () => {

    let payload = {
      username: "",
      role: "asd",
    };
    // Update Data
    const res = await request(app).post("/api/board/share?name=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

// Board Delete

describe("DELETE /api/board", () => {
  it("WHEN deleting board with valid params THEN expect ok status", async () => {
    const authData = await initAuth(app);
    const res = await request(app).delete("/api/board?name=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`);
    expect(res.statusCode).toBe(201);
  });
});

describe("DELETE /api/board", () => {
  it("WHEN deleting board with invalid params THEN expect error", async () => {
    const authData = await initAuth(app);
    const res = await request(app).delete("/api/board?foo=bar").set('Authorization', `Bearer ${authData.data?.accessToken}`);
    expect(res.statusCode).toBe(400);
  });
});

describe("DELETE /api/board", () => {
  it("WHEN deleting board with not existing board THEN expect error", async () => {
    const authData = await initAuth(app);
    const res = await request(app).delete("/api/board?name=qwe").set('Authorization', `Bearer ${authData.data?.accessToken}`);
    expect(res.statusCode).toBe(400);
  });
});