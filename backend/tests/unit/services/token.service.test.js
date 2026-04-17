import { jest, describe, beforeEach } from "@jest/globals";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { sanitizeUserData } from "../../../utils/user.helpers";

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    createHash: jest.fn(),
  },
}));

jest.unstable_mockModule("../../../config/database.js", () => ({
  default: {},
  query: jest.fn(),
  pool: jest.fn(),
}));

jest.unstable_mockModule("../../../repositories/token.repo.js", () => ({
  default: jest.fn(),
}));
jest.unstable_mockModule("../../../repositories/auth.repo.js", () => ({
  default: jest.fn(),
}));
jest.unstable_mockModule("../../../repositories/user.repo.js", () => ({
  default: jest.fn(),
}));

jest.unstable_mockModule("../../../utils/user.helpers.js", () => ({
  sanitizeUserData: jest.fn((data) => data),
}));

const bcryptModule = await import("bcrypt");

const { default: TokenRepository } =
  await import("../../../repositories/token.repo.js");
const { default: UserRepository } =
  await import("../../../repositories/user.repo.js");

const { default: TokenService } =
  await import("../../../services/token.service.js");

describe("TokenService --> UNIT TESTS", () => {
  let tokenService;
  let mockTokenRepository;
  let mockUserRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    UserRepository.mockClear();
    TokenRepository.mockClear();

    mockTokenRepository = {
      createToken: jest.fn(),
      findTokensByUserId: jest.fn(),
      findTokenByHash: jest.fn(),
      createToken: jest.fn(),
      revokeToken: jest.fn(),
      revokeAndReplaceToken: jest.fn(),
    };
    mockUserRepository = {
      findUserByName: jest.fn(),
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
    };

    TokenRepository.mockImplementation(() => mockTokenRepository);
    UserRepository.mockImplementation(() => mockUserRepository);

    tokenService = new TokenService();
  });
  describe("createToken", () => {
    it("successfull create token", async () => {
      const data = {
        id: 1,
        username: "username",
        ipAddress: "127.0.0.1",
        userAgent: "jest-test",
      };
      mockTokenRepository.createToken.mockResolvedValue(data);
      const result = await tokenService.createToken(data);

      expect(result).toBeDefined();
      expect(result).toMatchObject(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          storedToken: {
            id: 1,
            username: "username",
            ipAddress: "127.0.0.1",
            userAgent: "jest-test",
          },
        }),
      );
    });
  });

  describe("revokeToken", () => {
    it("successfully revoke token", async () => {
      const data = {
        userId: 1,
        tokenHash:
          "a53a598291bd48b20d7441987a50d742fe5b3bbde6953b8a1d49e839d24f4a0b",
      };
      mockTokenRepository.revokeToken.mockResolvedValue(data);
      const result = await tokenService.revokeToken(data);

      expect(result).toBeDefined();
      expect(result.userId).toBe(1);
      expect(result.tokenHash).toBe(
        "a53a598291bd48b20d7441987a50d742fe5b3bbde6953b8a1d49e839d24f4a0b",
      );
    });
  });

  describe("validateWithRotate", () => {
    it("successfully validate with rotation", async () => {
      const data = { newTokenId: "new-token-id", tokenId: "token-id" };
      mockUserRepository.findUserById.mockResolvedValue({
        id: 1,
        username: "username",
      });
      mockTokenRepository.findTokenByHash.mockResolvedValue(data.tokenId);
      mockTokenRepository.revokeAndReplaceToken.mockResolvedValue(data);
      mockTokenRepository.createToken.mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        storedToken: { id: 100 },
      });

      const result = await tokenService.validateWithRotate(data);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.newToken).toMatchObject(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          storedToken: {
            accessToken: "access-token",
            refreshToken: "refresh-token",
            storedToken: { id: 100 },
          },
        }),
      );
      expect(result.data.user).toBeDefined();
      expect(result.data.user.id).toBe(1);
      expect(result.data.user.username).toBe("username");
    });
  });

  describe("generateTokenHash", () => {
    it("should return a valid sha256 hex string", () => {
      const token = "test-token-123";
      const hash = tokenService.generateTokenHash(token);

      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should be deterministic (same input produces same output)", () => {
      const token = "consistent-token";

      const hash1 = tokenService.generateTokenHash(token);
      const hash2 = tokenService.generateTokenHash(token);

      expect(hash1).toBe(hash2);
    });

    it("should produce a specific known hash for a known input", () => {
      const input = "hello";
      const expectedHash =
        "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";

      const result = tokenService.generateTokenHash(input);

      expect(result).toBe(expectedHash);
    });

    it("should produce different hashes for different inputs", () => {
      const hash1 = tokenService.generateTokenHash("token-a");
      const hash2 = tokenService.generateTokenHash("token-b");

      expect(hash1).not.toBe(hash2);
    });

    it("should throw an error if input is not a string/buffer", () => {
      expect(() => {
        tokenService.generateTokenHash(null);
      }).toThrow();
    });
  });
});
