import { userSchemas } from "../../../schemas/user.schema";

describe("User Joi Schemas", () => {
  describe("createUser schema", () => {
    it("should validate a correct user object", () => {
      const validUser = {
        username: "johndoe123",
        email: "john@example.com",
        password: "securePassword123",
        age: 25,
        is_active: true,
      };
      const { error } = userSchemas.createUser.validate(validUser);
      expect(error).toBeUndefined();
    });

    it("should fail if username is too short", () => {
      const invalidUser = {
        username: "jo", // Assuming min is 3
        email: "john@example.com",
        password: "password123",
      };
      const { error } = userSchemas.createUser.validate(invalidUser);
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain("username");
    });

    it("should fail if email is invalid", () => {
      const { error } = userSchemas.createUser.validate({
        username: "johndoe",
        email: "not-an-email",
        password: "password123",
      });
      expect(error.details[0].type).toBe("string.email");
    });
  });

  describe("changePassword schema", () => {
    const validPassChange = {
      id: 1,
      old_password: "oldPassword123",
      new_password: "newPassword123",
      confirm_password: "newPassword123",
    };

    it("should validate when passwords match", () => {
      const { error } = userSchemas.changePassword.validate(validPassChange);
      expect(error).toBeUndefined();
    });

    it("should fail when confirm_password does not match new_password", () => {
      const invalidPassChange = {
        ...validPassChange,
        confirm_password: "wrongMatch",
      };
      const { error } = userSchemas.changePassword.validate(invalidPassChange);
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe("Password do not match");
    });

    it("should fail if new_password is provided without confirm_password", () => {
      const { id, old_password, new_password } = validPassChange;
      const { error } = userSchemas.changePassword.validate({
        id,
        old_password,
        new_password,
      });

      // Joi.with() ensures both must exist if one does
      expect(error).toBeDefined();
    });
  });

  describe("id schema", () => {
    it("should allow positive integers", () => {
      const { error } = userSchemas.id.validate({ id: 5 });
      expect(error).toBeUndefined();
    });

    it("should fail for non-positive integers", () => {
      const { error } = userSchemas.id.validate({ id: -1 });
      expect(error).toBeDefined();
    });
  });

  describe("updateUser schema", () => {
    it("should allow partial updates", () => {
      // id is required, but username/email are optional in this schema
      const { error } = userSchemas.updateUser.validate({ id: 1, age: 30 });
      expect(error).toBeUndefined();
    });
  });
});
