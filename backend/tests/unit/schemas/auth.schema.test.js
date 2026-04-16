
import { authSchema } from "../../../schemas/auth.schema.js";

describe('Auth Joi Schemas', () => {
  describe('login schema', () => {

    it("should validate a correct login object", () => {
      const validData = {
        username: "johndoe123",
        password: "securePassword123",
      };
      const { error } = authSchema.login.validate(validData);
      expect(error).toBeUndefined();
    });

    it("should validate a correct login with username", () => {
      const validUser = {
        username: "johndoe123",
        password: "securePassword123",

      };
      const { error } = authSchema.login.validate(validUser);
      expect(error).toBeUndefined();
    });
    it("should validate a correct login with email", () => {
      const validUser = {
        username: "johndoe123@email.com",
        password: "securePassword123",

      };
      const { error } = authSchema.login.validate(validUser);
      expect(error).toBeUndefined();
    });
    it("should fail if username is too short", () => {
      const validUser = {
        username: "jo",
        password: "securePassword123",

      };
      const { error } = authSchema.login.validate(validUser);
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain("username");
    });
    it("should fail if username is not aophanumeric", () => {
      const validUser = {
        username: "j_D",
        password: "securePassword123",

      };
      const { error } = authSchema.login.validate(validUser);
      expect(error).toBeDefined();
    });
    it("should fail if email is not valid", () => {
      const validUser = {
        username: "j_D@emzzz",
        password: "securePassword123",
      };
      const { error } = authSchema.login.validate(validUser);
      expect(error).toBeDefined();
    });
    it("should fail if username is empty", () => {
      const validUser = {
        username: "",
        password: "securePassword123",
      };
      const { error } = authSchema.login.validate(validUser);
      expect(error).toBeDefined();
    });
    it("should fail if password is empty", () => {
      const validUser = {
        username: "sdfsdfsdfs",
        password: "",
      };
      const { error } = authSchema.login.validate(validUser);
      expect(error).toBeDefined();
    });
    it("should fail if password is too large", () => {
      const validUser = {
        username: "sdfsdfsdfs",
        password: `
        00000000000
        1111111111
        2222222222
        3333333333
        4444444444
        55555555`,
      };
      const { error } = authSchema.login.validate(validUser);
      expect(error).toBeDefined();
    });
    it("should fail if password is too short", () => {
      const validUser = {
        username: "sdfsdfsdfs",
        password: "short",
      };
      const { error } = authSchema.login.validate(validUser);
      expect(error).toBeDefined();
    });
  })
});