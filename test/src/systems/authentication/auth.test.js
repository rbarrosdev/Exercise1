const auth = require("@/src/systems/authentication/auth");
const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

beforeEach(() => {
  //mock jsonwebtoken verify method
  jwt.verify.mockImplementation((token, secret) => {
    if (token === "validtoken")
      return {
        username: "testUser",
        roles: ["role_admin", "role_crm"],
        id: 1,
        org: [1]
      };
    else {
      throw new Exception("Invalid token");
    }
  });
});

// Mock ------------------------------------------
const mockRequestGetTokenFromHeaders = authHeader => ({
  headers: { authorization: authHeader }
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

//--------------------------------------------

const mockCheckAuthenticationRequest = authHeader => ({
  headers: { authorization: authHeader }
});

describe("checkAuthentication", () => {
  test("should return a null for invalid form token", async () => {
    const givenToken = "1234567890";
    const req = mockRequestGetTokenFromHeaders(givenToken);

    const token = await auth.getTokenFromHeaders(req);
    expect(token).toBeNull();
  });

  test("getTokenFromHeaders should return a valid trim token", async () => {
    const givenToken = "1234567890";
    const req = mockRequestGetTokenFromHeaders("Bearer " + givenToken);

    const token = await auth.getTokenFromHeaders(req);
    expect(token).toEqual(givenToken);
  });

  test("checkAuthentication Should be ok for the valid token ", async () => {
    const req = mockCheckAuthenticationRequest("Bearer validtoken");

    const res = mockResponse();

    const callbackForsuccessfull = err => {
      try {
        expect(err).toBeFalsy();
        expect(jwt.verify).toHaveBeenCalledTimes(1);
      } catch (error) {
        console.log(error);
      }
    };

    await auth.checkAuthentication(req, res, callbackForsuccessfull); //call back with req.Authenticated
  });

  test("checkAuthentication Should be Invalid Token", async () => {
    const decodedUser = {
      username: "testUser",
      roles: ["role_admin", "role_crm"],
      id: [1],
      org: null
    };
    const req = mockCheckAuthenticationRequest("Bearer invalidtoken");

    const res = mockResponse();

    await auth.checkAuthentication(req, res, () => {});

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith("Invalid Token");
  });

  test("Should be Unauthorized User ", async () => {
    const req = mockCheckAuthenticationRequest(
      null //no authentication header
    );

    const res = mockResponse();

    await auth.checkAuthentication(req, res, () => {});

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith("Unauthorized User");
  });
});

describe("checkAuthorization", () => {
  test("return true ", () => {
    require("@/src/systems/utils/arrayutility").init();
    let middleware = auth.checkAuthorization(["role_customer"]);

    let req = {
      isAdmin: true,
      user: { roles: [] }
    };
    req.authenticated = true;

    const res = mockResponse();

    //admin is true
    middleware(req, res, () => {
      expect(true).toBe(true);
    });

    req.isAdmin = false;
    req.user.roles = ["role_customer"];

    // admin is false but customer role
    middleware(req, res, () => {
      expect(true).toBe(true);
    });

    req.user.roles = [];

    middleware = auth.checkAuthorization(["authorized"]);

    //authenticated user just authorized
    middleware(req, res, () => {
      expect(true).toBe(true);
      expect(res.json).toHaveBeenCalledTimes(0);
    });

    req.isAdmin = false;
    req.user.roles = [];
    //token has no roles
    middleware = auth.checkAuthorization(["role_customer"]);

    middleware(req, res, () => {});
    expect(res.json).toHaveBeenCalledWith("Forbiden");
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
