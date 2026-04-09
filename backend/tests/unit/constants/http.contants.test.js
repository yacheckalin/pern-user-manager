import {
  HTTP_ACCEPTED,
  HTTP_BAD_GATEWAY,
  HTTP_BAD_REQUEST,
  HTTP_CONFLICT,
  HTTP_CREATED,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NO_CONTENT,
  HTTP_NOT_FOUND,
  HTTP_OK,
  HTTP_SERVICE_UNAVAILABLE,
  HTTP_UNAUTHORIZED,
  METHODS,
  HEADERS,
} from "../../../constants/index.js";

describe("HTTP Statuses", () => {
  describe("Success", () => {
    it("should have 200 status", () => {
      expect(HTTP_OK).toBeDefined();
      expect(HTTP_OK).toBe(200);
    });

    it("should have 201 status", () => {
      expect(HTTP_CREATED).toBeDefined();
      expect(HTTP_CREATED).toBe(201);
    });

    it("should have 202 status", () => {
      expect(HTTP_ACCEPTED).toBeDefined();
      expect(HTTP_ACCEPTED).toBe(202);
    });

    it("should have 204 status", () => {
      expect(HTTP_NO_CONTENT).toBeDefined();
      expect(HTTP_NO_CONTENT).toBe(204);
    });
  });

  describe("Client Errors", () => {
    it("should have 400", () => {
      expect(HTTP_BAD_REQUEST).toBeDefined();
      expect(HTTP_BAD_REQUEST).toBe(400);
    });

    it("should have 401", () => {
      expect(HTTP_UNAUTHORIZED).toBeDefined();
      expect(HTTP_UNAUTHORIZED).toBe(401);
    });

    it("should have 403", () => {
      expect(HTTP_FORBIDDEN).toBeDefined();
      expect(HTTP_FORBIDDEN).toBe(403);
    });

    it("should have 404", () => {
      expect(HTTP_NOT_FOUND).toBeDefined();
      expect(HTTP_NOT_FOUND).toBe(404);
    });

    it("should have 409", () => {
      expect(HTTP_CONFLICT).toBeDefined();
      expect(HTTP_CONFLICT).toBe(409);
    });
  });

  describe("Server Errors", () => {
    it("should have 500", () => {
      expect(HTTP_INTERNAL_SERVER_ERROR).toBeDefined();
      expect(HTTP_INTERNAL_SERVER_ERROR).toBe(500);
    });

    it("should have 502", () => {
      expect(HTTP_BAD_GATEWAY).toBeDefined();
      expect(HTTP_BAD_GATEWAY).toBe(502);
    });

    it("should have 503", () => {
      expect(HTTP_SERVICE_UNAVAILABLE).toBeDefined();
      expect(HTTP_SERVICE_UNAVAILABLE).toBe(503);
    });
  });

  describe("HTTP Methods", () => {
    it("should have all standard HTTP methods", () => {
      expect(METHODS.GET).toBe("GET");
      expect(METHODS.POST).toBe("POST");
      expect(METHODS.PUT).toBe("PUT");
      expect(METHODS.PATCH).toBe("PATCH");
      expect(METHODS.DELETE).toBe("DELETE");
    });

    it("should have no duplicate method values", () => {
      const values = Object.values(METHODS);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe("HTTP Headers", () => {
    it("should have common HTTP headers", () => {
      expect(HEADERS.CONTENT_TYPE).toBe("Content-Type");
      expect(HEADERS.ACCEPT).toBe("Accept");
      expect(HEADERS.CACHE_CONTROL).toBe("Cache-Control");
    });

    it("should have unique header names", () => {
      const values = Object.values(HEADERS);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });
});
