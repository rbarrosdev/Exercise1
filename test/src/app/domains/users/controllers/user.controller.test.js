const app = require("@/src/app/app");
const supertest = require("supertest");
const request = supertest(app);
const mongoDB = require("@/src/systems/setup/database-setup");
const jestConfig = require("@/jest.config");

/**
 * End to end testing
 */

jest.mock("@/src/app/domains/users/external/external.service.js", () =>
  require("../external/__mocks__/external.service")
);

beforeAll(async done => {
  await mongoDB.connect();
  await mongoDB.mongoose.connection.dropDatabase();
  await mongoDB.disconnect(done);
});

beforeEach(async () => {
  await mongoDB.connect();
});

afterEach(async done => {
  await mongoDB.disconnect(done);
});

describe("/client/register", () => {
  test("should create a new client user", async done => {
    const response = await request.post("/users/client/registration").send({
      email: "client@test.com",
      password: "password",
      organizations: ["1"],
      firstname: "client",
      lastname: "test"
    });

    expect(response.status).toBe(201);
    expect(response.body.userId).not.toBeNull();
    expect(response.body.token).not.toBeNull();

    const response2 = await request.post("/users/client/registration").send({
      email: "client@test.com",
      password: "password",
      organizations: ["1"],
      firstname: "client",
      lastname: "test"
    });

    expect(response2.status).toBe(409);
    expect(response2.body).toBe("email registration failed");

    done();
  });

  test("should throw error for email validation", async done => {
    const response = await request.post("/users/client/registration").send({
      password: "password",
      organizations: [],
      firstname: "admin",
      lastname: "test"
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual("should have required property 'email'");
    done();
  });

  test("should throw error for password validation", async done => {
    const response = await request.post("/users/client/registration").send({
      email: "test@test.com",
      organizations: [],
      firstname: "admin",
      lastname: "test"
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual("should have required property 'password'");
    done();
  });

  test("should throw error for firstname validation", async done => {
    const response = await request.post("/users/client/registration").send({
      email: "testfirstname@test.com",
      password: "password",
      organizations: [],
      lastname: "test"
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual("should have required property 'firstname'");
    done();
  });

  test("should throw error for lastname validation", async done => {
    const response = await request.post("/users/client/registration").send({
      email: "testfirstname@test.com",
      password: "password",
      roles: [],
      organizations: [],
      firstname: "admin"
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual("should have required property 'lastname'");
    done();
  });
});

describe("/admin/registration", () => {
  test("should create a new admin user", async done => {
    const response = await request.post("/users/admin/registration").send({
      email: "admin24@test.com",
      password: "password",
      roles: ["role_admin"],
      organizations: ["1"],
      firstname: "admin",
      lastname: "test"
    });

    expect(response.status).toBe(201);
    expect(response.body.userId).not.toBeNull();
    expect(response.body.token).not.toBeNull();

    const response2 = await request.post("/users/admin/registration").send({
      email: "admin24@test.com",
      password: "password",
      roles: ["role_admin"],
      organizations: ["1"],
      firstname: "admin",
      lastname: "test"
    });

    expect(response2.status).toBe(409);
    expect(response2.body).toBe("email registration failed");

    done();
  });

  test("should throw error for email validation", async done => {
    const response = await request.post("/users/admin/registration").send({
      password: "password",
      roles: [],
      organizations: [],
      firstname: "admin",
      lastname: "test"
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual("should have required property 'email'");
    done();
  });

  test("should throw error for firstname validation", async done => {
    const response = await request.post("/users/admin/registration").send({
      email: "testfirstname@test.com",
      password: "password",
      roles: [],
      organizations: [],
      lastname: "test"
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual("should have required property 'firstname'");
    done();
  });

  test("should throw error for lastname validation", async done => {
    const response = await request.post("/users/admin/registration").send({
      email: "testfirstname@test.com",
      password: "password",
      roles: [],
      organizations: [],
      firstname: "admin"
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual("should have required property 'lastname'");
    done();
  });
});

describe("/client/SignIn", () => {
  test("Should return ok for valid input without impersonation", async done => {
    const response = await request.post("/users/client/signIn").send({
      email: "client@test.com",
      password: "password"
    });

    expect(response.status).toBe(200);
    expect(response.body.userId).not.toBeNull();
    expect(response.body.token).not.toBeNull();

    done();
  });

  test("Should return error for invalid email input", async done => {
    const response = await request.post("/users/client/signIn").send({
      password: "password"
    });

    expect(response.status).toBe(422);
    expect(response.body).toBe("should have required property 'email'");

    done();
  });

  test("Should return error for invalid password input", async done => {
    const response = await request.post("/users/client/signIn").send({
      email: "client@test.com"
    });

    expect(response.status).toBe(422);
    expect(response.body).toBe("should have required property 'password'");

    done();
  });

  test("Should return error for invalid input", async done => {
    const response = await request
      .post("/users/client/signIn?clientId=WRONGOBJECTID")
      .send({
        email: "client@test.com",
        password: "password"
      });

    expect(response.status).toBe(422);
    expect(response.body).toBe("clientId is not a valid objectId");

    done();
  });

  test("Should return error for non existing valid object id", async done => {
    const response = await request
      .post("/users/client/signIn?clientId=4eb00f37cd42ef1d3a8fbc94")
      .send({
        email: "admin@test.com",
        password: "password"
      });

    expect(response.status).toBe(401);
    expect(response.body).toBe("invalid email or password");

    done();
  });
});

describe("/api/users/:id", () => {
  test("should return a user for valid inputs", async done => {
    const responseUser = await request.post("/users/client/signIn").send({
      email: "client@test.com",
      password: "password"
    });

    const responseUserChecker = await request
      .get("/users/" + responseUser.body.userId)
      .set({
        authorization: "Bearer " + responseUser.body.token
      });

    expect(responseUserChecker.body.user.firstname).toBe("client");
    expect(responseUserChecker.body.user.lastname).toBe("test");

    done();
  });
});

describe("/api/users/client/:id", () => {
  test("should return 204 with valid inputs", async done => {
    const responseUser = await request.post("/users/client/signIn").send({
      email: "client@test.com",
      password: "password"
    });

    expect(responseUser.status).toBe(200);

    const response = await request
      .put("/users/" + responseUser.body.userId)
      .set({
        authorization: "Bearer " + responseUser.body.token
      })
      .send({
        firstname: "Lee ming wa",
        lastname: "ballos",
        email: "client@test.com",
        roles: [],
        organizations: []
      });

    expect(response.status).toBe(204);

    const responseUserChecker = await request
      .get("/users/" + responseUser.body.userId)
      .set({
        authorization: "Bearer " + responseUser.body.token
      });

    expect(responseUserChecker.body.user.firstname).toBe("Lee ming wa");
    expect(responseUserChecker.body.user.lastname).toBe("ballos");

    done();
  });
});

describe("/api/users/:id", () => {
  test("should return 204 for valid delete by admin", async done => {
    let responseUser = await request.post("/users/client/signIn").send({
      email: "client@test.com",
      password: "password"
    });

    expect(responseUser.status).toBe(200);

    let response = await request
      .delete("/users/" + responseUser.body.userId)
      .set({
        authorization: "Bearer " + responseUser.body.token
      });

    expect(response.status).toBe(204);

    done();
  });
});
