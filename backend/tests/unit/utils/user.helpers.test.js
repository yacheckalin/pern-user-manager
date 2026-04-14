import { jest } from "@jest/globals";
import {
  sanitizeUserData,
  sanitizeUpdateUserPassword,
} from "../../../utils/user.helpers.js";

describe("User Helpers - Unit Tests", () => {
  describe("sanitizeUserData", () => {
    it("should sanitize valid user data correctly", () => {
      const input = {
        username: "  testuser  ",
        email: "Test.Email@Example.COM",
        password: "  password123  ",
        confirm_password: "   some_password   ",
        age: "25",
        is_active: "true",
        extraField: "should be preserved",
      };

      const result = sanitizeUserData(input);

      expect(result).toEqual({
        username: "testuser",
        email: "test.email@example.com",
        password: "password123",
        confirm_password: "some_password",
        age: 25,
        is_active: true,
        extraField: "should be preserved",
      });
    });

    it("should handle missing email field", () => {
      const input = {
        username: "testuser",
        password: "password123",
        age: 25,
        is_active: true,
      };

      const result = sanitizeUserData(input);

      expect(result.email).toBeUndefined();
      expect(result.username).toBe("testuser");
      expect(result.password).toBe("password123");
      expect(result.age).toBe(25);
      expect(result.is_active).toBe(true);
    });

    it("should handle null and undefined values", () => {
      const input = {
        username: null,
        email: undefined,
        password: null,
        age: undefined,
        is_active: null,
      };

      const result = sanitizeUserData(input);

      expect(result.username).toBeNull();
      expect(result.email).toBeUndefined();
      expect(result.password).toBeNull();
      expect(result.age).toBeNaN(); // validator.toInt("undefined") returns NaN
      expect(result.is_active).toBe(true); // validator.toBoolean("null") returns true
    });

    it("should handle empty strings", () => {
      const input = {
        username: "",
        email: "",
        password: "",
        age: "",
        is_active: "",
      };

      const result = sanitizeUserData(input);

      expect(result.username).toBe("");
      expect(result.email).toBe("");
      expect(result.password).toBe("");
      expect(result.age).toBe(0);
      expect(result.is_active).toBe(false);
    });

    it("should handle non-string types for string fields", () => {
      const input = {
        username: 123,
        email: 456,
        password: true,
        age: "invalid",
        is_active: "invalid",
      };

      const result = sanitizeUserData(input);

      expect(result.username).toBe(123); // not a string, so unchanged
      expect(result.email).toBe("@456"); // converted to string then normalized (no domain, so @ prefix added)
      expect(result.password).toBe(true); // not a string, so unchanged
      expect(result.age).toBeNaN(); // invalid number string
      expect(result.is_active).toBe(true); // validator.toBoolean("invalid") returns true
    });

    it("should handle boolean values correctly", () => {
      const input = {
        is_active: true,
      };

      const result = sanitizeUserData(input);

      expect(result.is_active).toBe(true);
    });

    it("should handle numeric age correctly", () => {
      const input = {
        age: 30,
      };

      const result = sanitizeUserData(input);

      expect(result.age).toBe(30);
    });

    it("should trim whitespace from string fields", () => {
      const input = {
        username: "  spaced user  ",
        password: "  spaced pass  ",
      };

      const result = sanitizeUserData(input);

      expect(result.username).toBe("spaced user");
      expect(result.password).toBe("spaced pass");
    });

    it("should normalize email addresses", () => {
      const input = {
        email: "Test.Email+Tag@Example.COM",
      };

      const result = sanitizeUserData(input);

      expect(result.email).toBe("test.email+tag@example.com");
    });
  });

  describe("sanitizeUpdateUserPassword", () => {
    it("should sanitize valid password update data correctly", () => {
      const input = {
        old_password: "  oldpass123  ",
        new_password: "  newpass456  ",
        confirm_password: "  confirmpass789  ",
        extraField: "should be preserved",
      };

      const result = sanitizeUpdateUserPassword(input);

      expect(result).toEqual({
        old_password: "oldpass123",
        new_password: "newpass456",
        confirm_password: "confirmpass789",
        extraField: "should be preserved",
      });
    });

    it("should handle missing fields", () => {
      const input = {
        old_password: "oldpass",
      };

      const result = sanitizeUpdateUserPassword(input);

      expect(result.old_password).toBe("oldpass");
      expect(result.new_password).toBeUndefined();
      expect(result.confirm_password).toBeUndefined();
    });

    it("should handle null and undefined values", () => {
      const input = {
        old_password: null,
        new_password: undefined,
        confirm_password: null,
      };

      const result = sanitizeUpdateUserPassword(input);

      expect(result.old_password).toBeNull();
      expect(result.new_password).toBeUndefined();
      expect(result.confirm_password).toBeNull();
    });

    it("should handle empty strings", () => {
      const input = {
        old_password: "",
        new_password: "",
        confirm_password: "",
      };

      const result = sanitizeUpdateUserPassword(input);

      expect(result.old_password).toBe("");
      expect(result.new_password).toBe("");
      expect(result.confirm_password).toBe("");
    });

    it("should handle non-string types", () => {
      const input = {
        old_password: 123,
        new_password: true,
        confirm_password: {},
      };

      const result = sanitizeUpdateUserPassword(input);

      expect(result.old_password).toBe(123); // not a string, unchanged
      expect(result.new_password).toBe(true); // not a string, unchanged
      expect(result.confirm_password).toStrictEqual({}); // not a string, unchanged
    });

    it("should trim whitespace from all password fields", () => {
      const input = {
        old_password: "  old pass  ",
        new_password: "  new pass  ",
        confirm_password: "  confirm pass  ",
      };

      const result = sanitizeUpdateUserPassword(input);

      expect(result.old_password).toBe("old pass");
      expect(result.new_password).toBe("new pass");
      expect(result.confirm_password).toBe("confirm pass");
    });
  });
});