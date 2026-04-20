import {
  APP_NAME,
  APP_VERSION,
  API_VERSION,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  ONE_DAY,
  ONE_HOUR,
  ONE_MINUTE,
  ONE_SECOND,
  ONE_WEEK,
  BCRYPT_ROUNDS,
  JWT_DEFAULTS,
  API_PREFIX
} from "../../../constants/index.js";

describe("App Constants", () => {
  describe("Application Metadata", () => {
    it("should have valid app name", () => {
      expect(APP_NAME).toBeDefined();
      expect(typeof APP_NAME).toBe("string");
      expect(APP_NAME.length).toBeGreaterThan(0);
    });

    it("should have valid version format", () => {
      expect(APP_VERSION).toBeDefined();
      expect(typeof APP_VERSION).toBe("string");
      // Expect format like "1.0.0" or "1.2.3"
      expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it("should have valid API version", () => {
      expect(API_VERSION).toBeDefined();
      expect(typeof API_VERSION).toBe("string");
      expect(API_VERSION).toMatch(/^v\d+$/);
    });
    it("should have valid API prefix", () => {
      expect(API_PREFIX).toBeDefined();
      expect(typeof API_PREFIX).toBe("string");
      expect(API_PREFIX).toMatch(/^\/api/);
    });
  });

  describe("Pagination Constants", () => {
    it("should have valid default page size", () => {
      expect(DEFAULT_PAGE_SIZE).toBeDefined();
      expect(typeof DEFAULT_PAGE_SIZE).toBe("number");
      expect(DEFAULT_PAGE_SIZE).toBeGreaterThan(0);
      expect(DEFAULT_PAGE_SIZE).toBeLessThanOrEqual(MAX_PAGE_SIZE);
    });

    it("should have valid max page size", () => {
      expect(MAX_PAGE_SIZE).toBeDefined();
      expect(typeof MAX_PAGE_SIZE).toBe("number");
      expect(MAX_PAGE_SIZE).toBeGreaterThan(0);
      expect(MAX_PAGE_SIZE).toBeGreaterThanOrEqual(DEFAULT_PAGE_SIZE);
    });

    it("should maintain max page size within reasonable limits", () => {
      expect(MAX_PAGE_SIZE).toBeLessThanOrEqual(1000);
    });
  });

  describe("Time Constants", () => {
    it("should have correct time conversions", () => {
      expect(ONE_SECOND).toBe(100);
      expect(ONE_MINUTE).toBe(60 * ONE_SECOND);
      expect(ONE_HOUR).toBe(60 * ONE_MINUTE);
      expect(ONE_DAY).toBe(24 * ONE_HOUR);
      expect(ONE_WEEK).toBe(7 * ONE_DAY);
    });

    it("should maintain correct relationships", () => {
      expect(ONE_MINUTE).toBe(ONE_SECOND * 60);
      expect(ONE_HOUR).toBe(ONE_MINUTE * 60);
      expect(ONE_DAY).toBe(ONE_HOUR * 24);
      expect(ONE_WEEK).toBe(ONE_DAY * 7);
    });
  });

  describe("Bcrypt Constants", () => {
    it("should have correct bcrypt rounds or salt value", () => {
      expect(BCRYPT_ROUNDS).toBeDefined();
      expect(typeof BCRYPT_ROUNDS).toBe("number");
      expect(BCRYPT_ROUNDS).toBe(10);
    });
  });

  describe("JWT Constants", () => {
    const checkJwtDefaults = [
      'EXPIRES_IN',
      'SECRET',
      'ACCESS_TOKEN_SECRET',
      'REFRESH_TOKEN_SECRET',
      'ACCESS_TOKEN_EXPIRES_IN',
      'REFRESH_TOKEN_EXPIRES_IN'
    ];

    const mockJwtDefault = {
      EXPIRES_IN: '1d',
      SECRET: 'default_jwt_secret',
      ACCESS_TOKEN_SECRET: 'super-secret-access-key-minimum-32-character',
      REFRESH_TOKEN_SECRET: 'super-secret-refresh-key-minimum-32-character',
      ACCESS_TOKEN_EXPIRES_IN: '30m',
      REFRESH_TOKEN_EXPIRES_IN: '7d'
    }


    it('should have all JWT_DEFAULTS constants', () => {
      checkJwtDefaults.forEach((item) => {
        expect(JWT_DEFAULTS[item]).toBeDefined();
        expect(typeof JWT_DEFAULTS[item]).toBe('string')
      })
    });

    it('should have unique JWT_DEFAULTS constants', () => {
      const uniqueValues = new Set(checkJwtDefaults);
      expect(checkJwtDefaults.length).toBe(uniqueValues.size)
    });

    it('should have JWT_DEFAULT constants default values', () => {
      expect(JWT_DEFAULTS).toEqual(mockJwtDefault)
    })
  })
});
