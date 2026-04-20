import RefreshToken from "../../../models/token.model.js";
import RefreshTokenRepository from "../../../repositories/token.repo.js";
import { jest, describe } from "@jest/globals";
import logger from '../../../logger.js';

const queryMock = jest.fn();
let mockDb = {
  pool: {
    query: queryMock,
  },
  query: queryMock,
  transaction: jest.fn(async (callback) => {
    return await callback({ query: queryMock });
  }),
};

describe("TokenServiceRepository", () => {
  let mockRepository;

  const mockTokenData = {
    id: "3a615243-b3d2-49e1-a3cd-91571d02b256",
    user_id: 1,
    token_hash:
      "4a5cb537765f3b23ee469f4ab075a646e0aafbe24c11264b03a25c544f9d00e7",
    user_agent: "jest-test",
    ip_address: "127.0.0.1",
    replaced_by_token_id: "b44a8f0f-c920-4db5-ab11-3b333f2612ca",
    expires_at: "2026-04-23 16:19:25.145+00",
    created_at: "2026-04-16 16:10:25.146355+00",
    revoked_at: null,
  };

  const mockRefreshTocken = new RefreshToken(mockTokenData);

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = new RefreshTokenRepository(mockDb.pool);
  });

  describe("findTokensByUserId", () => {
    it("should return data correctrly", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [mockTokenData] });
      const res = await mockRepository.findTokensByUserId(1);

      // logger.error(res);
      expect(res).toBeInstanceOf(Array);
      expect(res.length).toBe(1);
      expect(res[0].id).toBe("3a615243-b3d2-49e1-a3cd-91571d02b256");
      expect(res[0].userId).toBe(mockTokenData.user_id);
      expect(res[0].tokenHash).toBe(mockTokenData.token_hash);
      expect(res[0].userAgent).toBe(mockTokenData.user_agent);
      expect(res[0].ipAddress).toBe(mockTokenData.ip_address);
    });
    it("should return an empty array", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const res = await mockRepository.findTokensByUserId(1);
      expect(res).toBeInstanceOf(Array);
      expect(res.length).toBe(0);
    });
  });

  describe("findTokenByHash", () => {
    it("should return null", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const res = await mockRepository.findTokenByHash("hash");
      expect(res).toBeNull();
    });

    it("should return RefreshToken ", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [mockTokenData] });
      const res = await mockRepository.findTokenByHash("hash");

      expect(res).toBeInstanceOf(RefreshToken);
      expect(res.id).toBe(mockTokenData.id);
      expect(res.tokenHash).toBe(mockTokenData.token_hash);
      expect(res.userId).toBe(mockTokenData.user_id);
      expect(res.ipAddress).toBe(mockTokenData.ip_address);
    });
  });
  describe("createToken", () => {
    it("should return null", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const res = await mockRepository.createToken({});
      expect(res).toBeNull();
    });

    it("should return RefreshToken ", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [mockTokenData] });
      const res = await mockRepository.createToken({
        id: 1,
        tokenHash: "token",
        expiresAt: Date.now(),
        userAgent: "jest-test",
        ipAddress: "127.0.0.1",
      });

      expect(res).toBeInstanceOf(RefreshToken);
      expect(res.id).toBe(mockTokenData.id);
      expect(res.tokenHash).toBe(mockTokenData.token_hash);
      expect(res.userId).toBe(mockTokenData.user_id);
      expect(res.ipAddress).toBe(mockTokenData.ip_address);
    });
  });
  describe("revokeToken", () => {
    it("should return null", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const res = await mockRepository.revokeToken({});
      expect(res).toBeNull();
    });

    it("should return RefreshToken ", async () => {
      mockDb.pool.query.mockResolvedValue({
        rows: [{ ...mockTokenData, revoked_at: Date.now() }],
      });
      const res = await mockRepository.revokeToken({
        userId: 1,
        tokenHash: "token_hash",
      });

      expect(res).toBeInstanceOf(RefreshToken);
      expect(res.id).toBe(mockTokenData.id);
      expect(res.tokenHash).toBe(mockTokenData.token_hash);
      expect(res.userId).toBe(mockTokenData.user_id);
      expect(res.ipAddress).toBe(mockTokenData.ip_address);
      expect(res.revokeAt).not.toBeNull();
    });
  });
  describe("revokeAndReplaceToken", () => {
    it("should return null", async () => {
      mockDb.pool.query.mockResolvedValue({ rows: [] });
      const res = await mockRepository.revokeAndReplaceToken({});
      expect(res).toBeNull();
    });

    it("should return RefreshToken ", async () => {
      mockDb.pool.query.mockResolvedValue({
        rows: [{ ...mockTokenData, revoked_at: Date.now() }],
      });
      const res = await mockRepository.revokeAndReplaceToken({
        newToken: "token_hash",
        tokenId: "token_id",
      });

      expect(res).toBeInstanceOf(RefreshToken);
      expect(res.id).toBe(mockTokenData.id);
      expect(res.tokenHash).toBe(mockTokenData.token_hash);
      expect(res.userId).toBe(mockTokenData.user_id);
      expect(res.ipAddress).toBe(mockTokenData.ip_address);
      expect(res.revokeAt).not.toBeNull();
      expect(res.revokeAndReplaceToken).not.toBeNull();
    });
  });
});
