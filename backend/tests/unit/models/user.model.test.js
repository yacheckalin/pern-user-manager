import User from "../../../models/user.model.js";

describe("User Model - Unit Tests", () => {
  const date = new Date();
  // Arrange
  const userData = {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    password_hash: "hashed_password_123",
    is_active: true,
    age: 18,
    last_login: null,
    created_at: date,
    updated_at: date,
    activated_at: date,
  };
  describe("toJSON", () => {
    it("should exclude sensitive fields", () => {
      const user = new User(userData);

      // Act
      const json = user.toJSON();

      // Assert
      expect(json).not.toHaveProperty("passwordHash");
      expect(json).toHaveProperty("username", "john_doe");
      expect(json).toHaveProperty("email", "john@example.com");
      expect(json).toHaveProperty("age", 18);
      expect(json).toHaveProperty("lastLogin", null);
      expect(json).toHaveProperty("createdAt", date);
      expect(json).toHaveProperty("updatedAt", date);
      expect(json).toHaveProperty("activatedAt", date);
    });
  });

  describe("canLogin", () => {
    it("should return true", () => {
      expect(new User(userData).canLogin()).toBeTruthy();
    });

    it("should return false", () => {
      expect(new User({ is_active: false }).canLogin()).toBeFalsy();
    });
  });

  describe("isAdult", () => {
    it("should return true for age >= 18", () => {
      const adultUser = new User({ age: 25 });
      expect(adultUser.isAdult()).toBe(true);
    });

    it("should return false for age < 18", () => {
      const minorUser = new User({ age: 16 });
      expect(minorUser.isAdult()).toBe(false);
    });
  });

  describe("fromDatabase", () => {
    it("should return null", () => {
      expect(User.fromDatabase(null)).toBeNull();
    });

    it("should return new User Object", () => {
      expect(User.fromDatabase(userData)).toEqual({
        id: 1,
        username: "john_doe",
        email: "john@example.com",
        passwordHash: "hashed_password_123",
        isActive: true,
        age: 18,
        lastLogin: null,
        createdAt: date,
        updatedAt: date,
        activatedAt: date,
      });
    });
  });

  describe("fromDatabaseArray", () => {
    it("should return empty array", () => {
      expect(User.fromDatabaseArray([])).toEqual([]);
    });

    it("should return array of objects", () => {
      const data = [
        {
          id: 1,
          username: "john_doe",
          email: "john@example.com",
          password_hash: "hashed_password_123",
          is_active: true,
          age: 18,
          last_login: null,
          created_at: date,
          updated_at: date,
          activated_at: date,
        },
        {
          id: 2,
          username: "john_doe2",
          email: "john2@example.com",
          password_hash: "hashed_password_123",
          is_active: true,
          age: 22,
          last_login: null,
          created_at: date,
          updated_at: date,
          activated_at: date,
        },
      ];
      expect(User.fromDatabaseArray(data)).toEqual([
        {
          id: 1,
          username: "john_doe",
          email: "john@example.com",
          passwordHash: "hashed_password_123",
          isActive: true,
          age: 18,
          lastLogin: null,
          createdAt: date,
          updatedAt: date,
          activatedAt: date,
        },
        {
          id: 2,
          username: "john_doe2",
          email: "john2@example.com",
          passwordHash: "hashed_password_123",
          isActive: true,
          age: 22,
          lastLogin: null,
          createdAt: date,
          updatedAt: date,
          activatedAt: date,
        },
      ]);
    });
  });
});
