import { jest } from "@jest/globals";
import {
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_NO_CONTENT,
  TOKEN_ERRORS,
  USER_CODES,
  SERVER_ERROR,
} from "../../../constants/index.js";
import ApiError from "../../../errors/api.error.js";

jest.unstable_mockModule("../../../services/token.service.js", () => ({
  default: jest.fn().mockImplementation(() => ({
    deleteToken: jest.fn(),
    getAllByUserId: jest.fn(),
  })),
}));

const { default: TokenService } =
  await import("../../../services/token.service.js");
const { default: TokenController } =
  await import("../../../controllers/token.controller.js");

describe("TokenController - Unit Tests", () => {
  let tokenController;
  let mockTokenService;
  let req, res, next;

  beforeEach(() => {
    mockTokenService = {
      deleteToken: jest.fn(),
      getAllByUserId: jest.fn(),
    };

    TokenService.mockImplementation(() => mockTokenService);
    tokenController = new TokenController();

    // Mock request and response
    req = {
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("deleteToken", () => {
    it("should delete a token successfully", async () => {
      mockTokenService.deleteToken.mockResolvedValue({ id: 1, revokedAt: new Date() });
      req.params.id = "1";

      await tokenController.deleteToken(req, res, next);

      expect(mockTokenService.deleteToken).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(HTTP_NO_CONTENT);
      expect(res.send).toHaveBeenCalled();
    });

    it("should return NOT_FOUND error when token does not exist", async () => {
      mockTokenService.deleteToken.mockRejectedValue(
        new ApiError({
          message: TOKEN_ERRORS.TOKEN_NOT_FOUND,
          code: USER_CODES.TOKEN_NOT_FOUND,
          status: HTTP_NOT_FOUND,
        })
      );
      req.params.id = "999";

      await tokenController.deleteToken(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: TOKEN_ERRORS.TOKEN_NOT_FOUND,
          status: HTTP_NOT_FOUND,
        })
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it("should handle server errors when deleting token", async () => {
      mockTokenService.deleteToken.mockRejectedValue(
        new ApiError({
          message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
          status: HTTP_INTERNAL_SERVER_ERROR,
        })
      );
      req.params.id = "1";

      await tokenController.deleteToken(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: SERVER_ERROR.INTERNAL_SERVER_ERROR,
          status: HTTP_INTERNAL_SERVER_ERROR,
        })
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });
});
