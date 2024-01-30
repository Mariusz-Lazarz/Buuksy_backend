const { register, login } = require("../controllers/authController");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("register", () => {
  beforeEach(() => {
    User.findOne.mockReset();
    User.prototype.save.mockReset();
    bcrypt.hash.mockReset();
  });

  it("should return 400 if the email is already registered", async () => {
    User.findOne.mockResolvedValue({ email: "test@example.com" });

    const req = {
      body: {
        name: "Test",
        email: "test@example.com",
        password: "password123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email already registered",
    });
  });

  it("should register a new user and return 201", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPassword");

    const req = {
      body: {
        name: "NewUser",
        email: "new@example.com",
        password: "password123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
    });
  });
  it("should return 500 if a server error occurs", async () => {
    User.findOne.mockRejectedValue(new Error("Server error"));

    const req = {
      body: {
        name: "ErrorUser",
        email: "error@example.com",
        password: "password123",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
    });
  });
});

describe("login", () => {
  beforeEach(() => {
    User.findOne.mockReset();
    bcrypt.compare.mockReset();
    jwt.sign.mockReset();
  });

  it("should return 401 for non-existing user", async () => {
    User.findOne.mockResolvedValue(null);

    const req = {
      body: { email: "nonexistent@example.com", password: "password123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Authentication failed" });
  });

  it("should return 401 for wrong password", async () => {
    const mockUser = { email: "test@example.com", password: "hashedPassword" };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const req = {
      body: { email: "test@example.com", password: "wrongPassword" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Authentication failed" });
  });

  it("should return 200 and a token for successful login", async () => {
    const mockUser = {
      email: "test@example.com",
      name: "Test",
      password: "hashedPassword",
    };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("jwtToken");

    const req = {
      body: { email: "test@example.com", password: "correctPassword" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "jwtToken",
      user: {
        name: mockUser.name,
        email: mockUser.email,
      },
    });
  });
});
