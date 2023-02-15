import request from "supertest";
import db from "./utils/initDatabase";
import app from "./utils/initTests.js";
import initAuth from "./utils/intAuth";

let authData = {};

beforeAll(async () => {  
  await db.connect()
  authData = await initAuth(app);

  // create new board
  await request(app).post("/api/board").set('Authorization', `Bearer ${authData.data?.accessToken}`).send({
    name: "foo",
    description: "foo",
  });

  // create new column
  await request(app).post("/api/column").set('Authorization', `Bearer ${authData.data?.accessToken}`).send({
    board: "foo",
    column: "bar",
  });

  await request(app).post("/api/column").set('Authorization', `Bearer ${authData.data?.accessToken}`).send({
    board: "foo",
    column: "bar2",
  });
})

afterAll(async () => {
  await db.clearDatabase()
  await db.closeDatabase()
});


describe("POST /api/task", () => {
  it("WHEN creating new task with valid payload THEN expect ok status", async () => {
    let payload = {
      board: "foo",
      column: "bar",
      task: "baz"
    };
    const res = await request(app).post("/api/task").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(201);
  });
});

describe("POST /api/task", () => {
  it("WHEN creating new task with invalid payload THEN expect error", async () => {
    let payload = {
      board: "",
      column: "",
      task: ""
    };
    const res = await request(app).post("/api/task").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/task", () => {
  it("WHEN creating new task with invalid task THEN expect error", async () => {
    let payload = {
      board: "foo",
      column: "bar",
      task: ""
    };
    const res = await request(app).post("/api/task").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/task", () => {
  it("WHEN creating new task with invalid column THEN expect error", async () => {
    let payload = {
      board: "foo",
      column: "",
      task: "baz"
    };
    const res = await request(app).post("/api/task").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/task", () => {
  it("WHEN creating new task with invalid board THEN expect error", async () => {
    let payload = {
      board: "",
      column: "bar",
      task: "baz"
    };
    const res = await request(app).post("/api/task").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe("PUT /api/task", () => {
  it("WHEN update task with valid payload THEN expect ok status", async () => {
    let payload = {
      column: "bar",
      task: "baz"
    };
    // Update Data
    const res = await request(app).put("/api/task?board=foo&column=bar&task=baz").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(201);
  });
}); 

describe("PUT /api/task", () => {
  it("WHEN update task with invalid payload THEN expect failed", async () => {
    let payload = {
      column: "",
      task: ""
    };
    // Update Data
    const res = await request(app).put("/api/task?board=foo&column=bar&task=baz").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
}); 

describe("PUT /api/task", () => {
  it("WHEN update task with invalid task THEN expect failed", async () => {
    let payload = {
      column: "bar",
      task: "baz"
    };
    // Update Data
    const res = await request(app).put("/api/task?board=foo&column=bar&task=zxc").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
}); 

describe("PUT /api/task", () => {
  it("WHEN moving task to different column AND column exists THEN expect ok status", async () => {
    let payload = {
      column: "bar2",
      task: "baz"
    };
    // Update Data
    const res = await request(app).put("/api/task?board=foo&column=bar&task=baz").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(201);
  });
}); 

describe("PUT /api/task", () => {
  it("WHEN moving task to different column AND column not exists THEN expect error", async () => {
    let payload = {
      column: "bar3",
      task: "baz"
    };
    // Update Data
    const res = await request(app).put("/api/task?board=foo&column=bar2&task=baz").set('Authorization', `Bearer ${authData.data?.accessToken}`).send(payload);
    expect(res.statusCode).toBe(400);
  });
}); 


describe("DELETE /api/task", () => {
  it("WHEN deleting task with valid params THEN expect ok status", async () => {
    // test delete
    const res = await request(app).delete("/api/task?board=foo&column=bar&task=baz").set('Authorization', `Bearer ${authData.data?.accessToken}`);
    expect(res.statusCode).toBe(201);
  });
});

describe("DELETE /api/task", () => {
  it("WHEN deleting task with valid params THEN expect ok status", async () => {
    // test delete
    const res = await request(app).delete("/api/task?board=zxc&column=zxc&task=zxc").set('Authorization', `Bearer ${authData.data?.accessToken}`);
    expect(res.statusCode).toBe(400);
  });
});