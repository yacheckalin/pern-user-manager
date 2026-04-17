import RefreshToken from "../../../models/token.model";

describe("RefreshToken Model Unit Test", () => {
  const mockData = {
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
  it("toJSON should return camelCase data", () => {
    const token = new RefreshToken(mockData).toJSON();
    expect(token.id).toBe("3a615243-b3d2-49e1-a3cd-91571d02b256");
    expect(token.userId).toBe(1);
    expect(token.tokenHash).toBe(
      "4a5cb537765f3b23ee469f4ab075a646e0aafbe24c11264b03a25c544f9d00e7",
    );
    expect(token.userAgent).toBe("jest-test");
    expect(token.ipAddress).toBe("127.0.0.1");
    expect(token.replacedByTokenId).toBe(
      "b44a8f0f-c920-4db5-ab11-3b333f2612ca",
    );
    expect(token.expiresAt).toBe("2026-04-23 16:19:25.145+00");
    expect(token.createdAt).toBe("2026-04-16 16:10:25.146355+00");
    expect(token.revokedAt).toBeNull();
  });
  it("fromDatabase should return null", () => {
    expect(RefreshToken.fromDatabase(null)).toBeNull();
  });
  it("fromDatabase should return valid RefreshToken object", () => {
    expect(RefreshToken.fromDatabase(mockData)).toEqual({
      id: "3a615243-b3d2-49e1-a3cd-91571d02b256",
      userId: 1,
      tokenHash:
        "4a5cb537765f3b23ee469f4ab075a646e0aafbe24c11264b03a25c544f9d00e7",
      userAgent: "jest-test",
      ipAddress: "127.0.0.1",
      replacedByTokenId: "b44a8f0f-c920-4db5-ab11-3b333f2612ca",
      expiresAt: "2026-04-23 16:19:25.145+00",
      createdAt: "2026-04-16 16:10:25.146355+00",
      revokedAt: null,
    });
  });

  it("fromDatabaseArray should return empty array", () => {
    expect(RefreshToken.fromDatabaseArray([])).toEqual([]);
  });

  it("fromDatabaseArray should return array of RefreshToken objects", () => {
    const data = [
      { ...mockData },
      {
        ...mockData,
        id: "2ced5a63-7ce3-478d-9728-7a7d9b69ee1d",
        token_hash:
          "a53a598291bd48b20d7441987a50d742fe5b3bbde6953b8a1d49e839d24f4a0b",
      },
    ];
    expect(RefreshToken.fromDatabaseArray(data)).toEqual([
      {
        id: "3a615243-b3d2-49e1-a3cd-91571d02b256",
        userId: 1,
        tokenHash:
          "4a5cb537765f3b23ee469f4ab075a646e0aafbe24c11264b03a25c544f9d00e7",
        userAgent: "jest-test",
        ipAddress: "127.0.0.1",
        replacedByTokenId: "b44a8f0f-c920-4db5-ab11-3b333f2612ca",
        expiresAt: "2026-04-23 16:19:25.145+00",
        createdAt: "2026-04-16 16:10:25.146355+00",
        revokedAt: null,
      },
      {
        id: "2ced5a63-7ce3-478d-9728-7a7d9b69ee1d",
        userId: 1,
        tokenHash:
          "a53a598291bd48b20d7441987a50d742fe5b3bbde6953b8a1d49e839d24f4a0b",
        userAgent: "jest-test",
        ipAddress: "127.0.0.1",
        replacedByTokenId: "b44a8f0f-c920-4db5-ab11-3b333f2612ca",
        expiresAt: "2026-04-23 16:19:25.145+00",
        createdAt: "2026-04-16 16:10:25.146355+00",
        revokedAt: null,
      },
    ]);
  });
});
