import { USER_ERRORS, USER_VALIDATION } from "../../../constants";
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

  describe("registerUser schema", () => {
    let mockValidUser = {};
    beforeEach(() => {
      mockValidUser = {
        username: "someUserName",
        password: "some_user_password",
        confirm_password: "some_user_password",
        email: "some@email.com",
        age: 30
      }
    })
    it("should validate register new user", () => {

      const { error } = userSchemas.registerUser.validate(mockValidUser);
      expect(error).toBeUndefined();
    });

    it('should fail on not alphanumeric username', () => {
      const { error } = userSchemas.registerUser.validate({ ...mockValidUser, username: "some_not_valid_username" });
      expect(error).toBeDefined();
    })
    it('should fail on not long enough password ', () => {
      const { error } = userSchemas.registerUser.validate({ ...mockValidUser, password: "2" });
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe(`\"password\" length must be at least ${USER_VALIDATION.PASSWORD_MIN_LENGTH} characters long`)
    })
    it('should fail on empty password', () => {
      const { error } = userSchemas.registerUser.validate({ ...mockValidUser, password: "" });
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe(`\"password\" is not allowed to be empty`)
    })
    it('should fail on empty email', () => {
      const { error } = userSchemas.registerUser.validate({ ...mockValidUser, email: "" });
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe(`\"email\" is not allowed to be empty`)
    })
    it('should fail when email not valid', () => {
      const { error } = userSchemas.registerUser.validate({ ...mockValidUser, email: "some@ss" });
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('\"email\" must be a valid email')
    });
    it('should fail when confirm password is not valid', () => {
      const { error } = userSchemas.registerUser.validate({ ...mockValidUser, confirm_password: null });
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe(USER_ERRORS.INVALID_CONFIRM_PASSWORD);
    })
    it('should fail when confirm password is not the same as password', () => {
      const { error } = userSchemas.registerUser.validate({ ...mockValidUser, confirm_password: "some_other_password" });
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe(USER_ERRORS.INVALID_CONFIRM_PASSWORD);
    })
    it('should fail when age is not integer', () => {
      const { error } = userSchemas.registerUser.validate({ ...mockValidUser, age: 'xxx' });
      expect(error).toBeDefined();

      expect(error.details[0].message).toBe(`\"age\" must be a number`)
    })
  })
});
