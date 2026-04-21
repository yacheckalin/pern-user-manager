import {
  USER_ERRORS,
  DB_ERRORS,
  AUTH_ERRORS,
  WRONG_IP,
  USER_CODES,
} from "../../../constants/index.js";

describe("Errors Constants", () => {
  describe("User Errors", () => {
    const expectedErrors = {
      NOT_FOUND: "User not found",
      ALREADY_EXISTS: "User already exists",
      EMAIL_TAKEN: "Email is already registered",
      USERNAME_TAKEN: "Username is already taken",
      INVALID_AGE: "Age must be between 13 and 150",
      INVALID_EMAIL: "Please provide a valid email address",
      INVALID_USERNAME: "Username must be at least 3 characters",
      INVALID_PASSWORD: "Password must be at least 6 characters",
      INVALID_NEW_PASSWORD: "New password must be at least 6 characters",
      INVALID_OLD_PASSWORD: "Old password must be at least 6 characters",
      INVALID_CONFIRM_PASSWORD: "Confirm password is not valid",
      OLD_PASSWORD_INVALID: "Old password is not valid",
      NEW_PASSWORD_THE_SAME: "New password is the same as old one",
      ALREADY_ACTIVATED: "User has already activated",
    };

    it("should have only valid error types", () => {
      const expectedTypes = [
        "NOT_FOUND",
        "ALREADY_EXISTS",
        "EMAIL_TAKEN",
        "USERNAME_TAKEN",
        "INVALID_AGE",
        "INVALID_EMAIL",
        "INVALID_USERNAME",
        "INVALID_PASSWORD",
        "INVALID_NEW_PASSWORD",
        "INVALID_OLD_PASSWORD",
        "INVALID_CONFIRM_PASSWORD",
        "OLD_PASSWORD_INVALID",
        "NEW_PASSWORD_THE_SAME",
        "ALREADY_ACTIVATED",
      ];

      expectedTypes.forEach((type) => {
        expect(USER_ERRORS[type]).toBeDefined();
        expect(typeof USER_ERRORS[type]).toBe("string");
      });
    });

    it("should have unique errors name", () => {
      const errorTypes = Object.keys(USER_ERRORS);
      const uniqueTypes = new Set(errorTypes);
      expect(errorTypes.length).toBe(uniqueTypes.size);
    });

    it("should contain all user errors with correct values", () => {
      expect(USER_ERRORS).toEqual(expectedErrors);
    });
  });
  describe('User Codes', () => {
    const expectedCodes = {
      USER_NOT_FOUND: 'USER_NOT_FOUND',
      ALREADY_ACTIVATED: "USER_ALREADY_ACTIVATED",
      INVALID_USERNAME: "INVALID_USERNAME",
      INVALID_EMAIL: "INVALID_EMAIL",
      INVALID_PASSWORD: "INVALID_PASSWORD",
      INVALID_AGE: "INVALID_AGE",
      USERNAME_TAKEN: "USERNAME_TAKEN",
      EMAIL_TAKEN: "EMAIL_TAKEN",
      INVALID_NEW_PASSWORD: "INVALID_NEW_PASSWORD",
      INVALID_OLD_PASSWORD: "INVALID_OLD_PASSWORD",
      INVALID_CONFIRM_PASSWORD: "INVALID_CONFIRM_PASSWORD",
      OLD_PASSWORD_INVALID: "OLD_PASSWORD_INVALID",
      NEW_PASSWORD_THE_SAME: "NEW_PASSWORD_THE_SAME",
      INVALID_USERNAME_OR_EMAIL: "INVALID_USERNAME_OR_EMAIL",
      USERNAME_MIN_LENGTH: "USERNAME_MIN_LENGTH",
      USERNAME_MAX_LENGTH: "USERNAME_MAX_LENGTH",
      PASSWORD_MIN_LENGTH: "PASSWORD_MIN_LENGTH",
      PASSWORD_MAX_LENGTH: "PASSWORD_MAX_LENGTH",
      TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND",
      INVALID_CRIDENTIALS: "INVALID_CRIDENTIALS",
      WRONG_IP: "WRONG_IP"
    }


    it('should have only valid types codes', () => {
      const validCodes = [
        'USER_NOT_FOUND',
        "ALREADY_ACTIVATED",
        "INVALID_USERNAME",
        "INVALID_EMAIL",
        "INVALID_PASSWORD",
        "INVALID_AGE",
        "USERNAME_TAKEN",
        "EMAIL_TAKEN",
        "INVALID_NEW_PASSWORD",
        "INVALID_OLD_PASSWORD",
        "INVALID_CONFIRM_PASSWORD",
        "OLD_PASSWORD_INVALID",
        "NEW_PASSWORD_THE_SAME",
        "INVALID_USERNAME_OR_EMAIL",
        "USERNAME_MIN_LENGTH",
        "USERNAME_MAX_LENGTH",
        "PASSWORD_MIN_LENGTH",
        "PASSWORD_MAX_LENGTH",
        "TOKEN_NOT_FOUND",
        "INVALID_CRIDENTIALS",
        "WRONG_IP"
      ];

      validCodes.forEach((code) => {
        expect(USER_CODES[code]).toBeDefined();
        expect(typeof USER_CODES[code]).toBe('string');
      })
    })

    it('user codes should have unique value names', () => {
      const keys = Object.keys(expectedCodes);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    })

    it('should contain all codes with the valid values', () => {
      expect(USER_CODES).toEqual(expectedCodes)
    })

  })

  describe("Database Errors", () => {
    it("should define CONNECTION_FAILED", () => {
      expect(DB_ERRORS.CONNECTION_FAILED).toBeDefined();
      expect(DB_ERRORS.CONNECTION_FAILED).toBe("Database connection failed");
    });

    it("should define QUERY_FAILED", () => {
      expect(DB_ERRORS.QUERY_FAILED).toBeDefined();
      expect(DB_ERRORS.QUERY_FAILED).toBe("Database query failed");
    });
  });

  describe("Authenticate Errors", () => {
    const expectedErrors = {
      INVALID_CRIDENTIALS: "Invalid cridentials",
      INVALID_USERNAME_OR_EMAIL: "Invalid username or email",
      INVALID_EMAIL: "Invalid email",
      INVALID_USERNAME: "Invalid username",
      INVALID_PASSWORD: "Invalid password",
      UNAUTHORIZED_ACCESS: "Unauthorized access detected",
    };
    it("should have all expected types", () => {
      const expectedTypes = [
        "INVALID_CRIDENTIALS",
        "INVALID_USERNAME_OR_EMAIL",
        "INVALID_EMAIL",
        "INVALID_USERNAME",
        "INVALID_PASSWORD",
      ];

      expectedTypes.forEach((type) => {
        expect(AUTH_ERRORS[type]).toBeDefined();
        expect(typeof AUTH_ERRORS[type]).toBe("string");
      });
    });

    it("should have unique errors name", () => {
      const errorTypes = Object.keys(AUTH_ERRORS);
      const uniqueTypes = new Set(errorTypes);
      expect(errorTypes.length).toBe(uniqueTypes.size);
    });

    it("should contain all user errors with correct values", () => {
      expect(AUTH_ERRORS).toEqual(expectedErrors);
    });
  });
  describe("Other Errors", () => {
    it("should have WRONG_IP", () => {
      expect(WRONG_IP).toEqual("Wrong IP Address");
    });
  });
});
