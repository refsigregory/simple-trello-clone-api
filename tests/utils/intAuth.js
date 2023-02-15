import request from "supertest";

const initAuth = async (app) => {
  // create new valid user
  let payload = {
    username: "juniar1",
    email: "juniar@almende.org",
    password: "qweQWE321#",
    firstName: "juniar",
    lastName: "rakhman"
  };
  await request(app).post("/api/auth/register").send(payload);

  const res = await request(app).post("/api/auth/login").send({
    username: payload.username,
    password: payload.password,
  });

  return res.body;
};

export default initAuth;