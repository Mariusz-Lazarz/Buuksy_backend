const {
  getSalonById,
  getAllSalons,
} = require("../controllers/salonsController");
const Salon = require("../models/Salon");

jest.mock("../models/Salon");

function createMockReqRes(params = {}, query = {}) {
  let statusCode;
  let responseBody;

  const req = { params, query };
  const res = {
    status: function (code) {
      statusCode = code;
      return this;
    },
    json: function (response) {
      responseBody = response;
    },
  };

  return { req, res, getResponse: () => ({ statusCode, responseBody }) };
}

describe("getSalons", () => {
  beforeEach(() => {
    Salon.findById.mockReset();
    Salon.find.mockReset();
  });

  it("should return a salon if it is found", async () => {
    const mockSalon = { id: "123", name: "Test Salon" };
    Salon.findById.mockResolvedValue(mockSalon);

    const { req, res, getResponse } = createMockReqRes("123");
    await getSalonById(req, res);
    const { statusCode, responseBody } = getResponse();

    expect(statusCode).toBe(200);
    expect(responseBody).toEqual(mockSalon);
  });

  it("should return 404 if the salon is not found", async () => {
    Salon.findById.mockResolvedValue(null);

    const { req, res, getResponse } = createMockReqRes("nonExistingId");
    await getSalonById(req, res);
    const { statusCode, responseBody } = getResponse();

    expect(statusCode).toBe(404);
    expect(responseBody).toEqual({ message: "Salon not found" });
  });

  it("should return all salons when no category is specified", async () => {
    const mockSalons = [{ name: "Salon1" }, { name: "Salon2" }];
    Salon.find.mockResolvedValue(mockSalons);

    const { req, res, getResponse } = createMockReqRes();
    await getAllSalons(req, res);
    const { statusCode, responseBody } = getResponse();

    expect(statusCode).toBe(200);
    expect(responseBody).toEqual(mockSalons);
  });

  it("should return salons filtered by category", async () => {
    const mockSalons = [{ name: "Salon1", category: "hair" }];
    Salon.find.mockResolvedValue(mockSalons);

    const { req, res, getResponse } = createMockReqRes({ category: "hair" });
    await getAllSalons(req, res);
    const { statusCode, responseBody } = getResponse();

    expect(statusCode).toBe(200);
    expect(responseBody).toEqual(mockSalons);
  });
});
