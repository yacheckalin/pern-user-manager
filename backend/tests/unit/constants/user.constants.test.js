import {
  USER_DEFAULTS,
  USER_STATUS,
  USER_VALIDATION,
  USER_EVENTS,
  USER_MESSAGES,
} from "../../../constants/index.js";

describe("User Constants", () => {
  describe("User statuses", () => {
    it("should have ACTIVE status", () => {
      expect(USER_STATUS.ACTIVE).toBeDefined();
      expect(USER_STATUS.ACTIVE).toBe("active");
    });

    it("should have INACTIVE status", () => {
      expect(USER_STATUS.INACTIVE).toBeDefined();
      expect(USER_STATUS.INACTIVE).toBe("inactive");
    });

    it("should have unique status values", () => {
      const statuses = Object.values(USER_STATUS);
      const uniqueStatuses = new Set(statuses);
      expect(statuses.length).toBe(uniqueStatuses.size);
    });
  });

  describe("User Validation Rules", () => {
    describe("Username validation", () => {
      it("should have valid username constraints", () => {
        expect(USER_VALIDATION.USERNAME_MIN_LENGTH).toBeGreaterThanOrEqual(3);
        expect(USER_VALIDATION.USERNAME_MAX_LENGTH).toBeLessThanOrEqual(50);
        expect(USER_VALIDATION.USERNAME_MAX_LENGTH).toBeGreaterThan(
          USER_VALIDATION.USERNAME_MIN_LENGTH,
        );
      });
    });

    describe("Password validateion", () => {
      it("should have valid password constraints", () => {
        expect(USER_VALIDATION.PASSWORD_MIN_LENGTH).toBeGreaterThanOrEqual(6);
        expect(USER_VALIDATION.PASSWORD_MAX_LENGTH).toBeLessThanOrEqual(100);
        expect(USER_VALIDATION.PASSWORD_MIN_LENGTH).toBeLessThan(
          USER_VALIDATION.PASSWORD_MAX_LENGTH,
        );
      });
    });

    describe("Age validation", () => {
      it("should have valid age constraints", () => {
        expect(USER_VALIDATION.AGE_MAX).toBeLessThanOrEqual(150);
        expect(USER_VALIDATION.AGE_MIN).toBeGreaterThanOrEqual(13);
        expect(USER_VALIDATION.AGE_MAX).toBeGreaterThan(
          USER_VALIDATION.AGE_MIN,
        );
      });
    });

    describe("User Defaults", () => {
      it("should have is_active = false", () => {
        expect(USER_DEFAULTS.IS_ACTIVE).toBe(false);
      });

      it("should have login_count = 0", () => {
        expect(USER_DEFAULTS.LOGIN_COUNT).toBe(0);
      });
    });

    describe("User Events", () => {
      it("should have all required event types", () => {
        const requiredEvents = [
          "CREATED",
          "UPDATED",
          "DELETED",
          "LOGIN",
          "LOGOUT",
          "PASSWORD_CHANGED",
          "ACTIVATED",
          "REGISTERED"
        ];

        requiredEvents.forEach((event) => {
          expect(USER_EVENTS[event]).toBeDefined();
          expect(typeof USER_EVENTS[event]).toBe("string");
        });
      });

      it("should have unique event names", () => {
        const events = Object.values(USER_EVENTS);
        const uniqueEvents = new Set(events);
        expect(events.length).toBe(uniqueEvents.size);
      });
    });

    describe("User success messages", () => {
      it("should have all required messages", () => {
        const requiredMessages = [
          "CREATED",
          "UPDATED",
          "DELETED",
          "ACTIVATED",
          "PASSWORD_CHANGED",
        ];

        requiredMessages.forEach((message) => {
          expect(USER_MESSAGES[message]).toBeDefined();
          expect(typeof USER_MESSAGES[message]).toBe("string");
          expect(USER_MESSAGES[message].length).toBeGreaterThan(0);
        });
      });

      it("should have unique names", () => {
        const messageTypes = Object.values(USER_MESSAGES);
        const uniqueTypes = new Set(messageTypes);
        expect(messageTypes.length).toBe(uniqueTypes.size);
      });

      it("should contain all expected keys with correct string values", () => {
        const expected = {
          CREATED: "User was created successfully",
          UPDATED: "User was updated successfully",
          DELETED: "User was deleted successfully",
          ACTIVATED: "User was activated successfully",
          PASSWORD_CHANGED: "User password was changed successfully",
          REGISTERED: "User was registered successfully"
        };

        expect(USER_MESSAGES).toEqual(expected);
      });
    });
  });
});
