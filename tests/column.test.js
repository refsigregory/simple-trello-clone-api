import request from "supertest";
import db from "./utils/initDatabase";
import app from "./utils/initTests.js";
import initAuth from "./utils/intAuth";

let authData = {};

beforeAll(async () => {  
  await db.connect()
  authData = await initAuth(app);

  // create new board
  let payload = {
    name: "foo",
    description: "foo",
  };
  await request(app).post("/api/board").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
})

afterAll(async () => {
  await db.clearDatabase()
  await db.closeDatabase()
});


describe("POST /api/column", () => {
  it("WHEN creating new column with valid payload THEN expect ok status", async () => {
    let payload = {
      board: "foo",
      column: "foo",
    };
    const res = await request(app).post("/api/column").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(201);
  });
});

describe("POST /api/column", () => {
  it("WHEN creating new column with invalid payload THEN expect error", async () => {
    let payload = {
      column: "",
    };
    const res = await request(app).post("/api/column").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/column", () => {
  it("WHEN creating new column with invalid board THEN expect error", async () => {
    let payload = {
      board: "",
      column: "foo",
    };
    const res = await request(app).post("/api/column").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/column", () => {
  it("WHEN creating new column with invalid column THEN expect error", async () => {
    let payload = {
      board: "foo",
      column: "",
    };
    const res = await request(app).post("/api/column").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/column", () => {
  it("WHEN creating another column with valid payload THEN expect ok status", async () => {
    let payload = {
      board: "foo",
      column: "qux",
    };
    const res = await request(app).post("/api/column").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(201);
  });
});

describe("PUT /api/column", () => {
  it("WHEN creating update column with valid payload THEN expect ok status", async () => {
    let payload = {
      column: "foo",
      position: 2
    };
    // Update Data
    const res = await request(app).put("/api/column?board=foo&column=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(201);
  });
}); 

describe("PUT /api/column", () => {
  it("WHEN creating update column with invalid payload THEN expect error", async () => {
    let payload = {
      column: "",
      position: 2
    };
    // Update Data
    const res = await request(app).put("/api/column?board=foo&column=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
}); 

describe("PUT /api/column", () => {
  it("WHEN creating update column with invalid column THEN expect error", async () => {
    let payload = {
      column: "",
      position: 2
    };
    // Update Data
    const res = await request(app).put("/api/column?board=foo&column=zxc").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("PUT /api/column", () => {
  it("WHEN creating update board with invalid column THEN expect error", async () => {
    let payload = {
      column: "",
      position: 2
    };
    // Update Data
    const res = await request(app).put("/api/column?board=zxc&column=foo").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("DELETE /api/column", () => {
  it("WHEN deleting board with valid params THEN expect ok status", async () => {
    // create new colum
    await request(app).post("/api/column").set('Authorization', `Bearer ${authData.data?.accessToken}`).send({
      board: "foo",
      column: "bar",
    });

    // test delete
    const res = await request(app).delete("/api/column?board=foo&column=bar").set('Authorization', `Bearer ${authData.data?.accessToken}`);
    expect(res.statusCode).toBe(201);
  });
});


describe("DELETE /api/column", () => {
  it("WHEN deleting board with invalid params THEN expect error", async () => {
    // create new colum
    await request(app).post("/api/column").set('Authorization', `Bearer ${authData.data?.accessToken}`).send({
      board: "foo",
      column: "bar",
    });

    // test delete
    const res = await request(app).delete("/api/column?board=zxc&column=zxc").set('Authorization', `Bearer ${authData.data?.accessToken}`);
    expect(res.statusCode).toBe(400);
  });
});

