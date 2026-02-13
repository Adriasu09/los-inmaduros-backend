import { describe, it, expect } from "@jest/globals";
import {
  createRouteCallSchema,
  getRouteCallsSchema,
} from "../../../modules/route-calls/route-calls.validation";

describe("Route Calls Validation", () => {
  describe("createRouteCallSchema", () => {
    it("should validate a valid route call with predefined route", () => {
      const validData = {
        body: {
          routeId: "123e4567-e89b-12d3-a456-426614174000",
          dateRoute: "2026-12-25T10:00:00Z",
          pace: "MARIPOSA",
          meetingPoints: [
            {
              type: "PRIMARY",
              name: "Explanada",
              location: "https://maps.google.com/test",
            },
          ],
        },
      };

      const result = createRouteCallSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject route call with past date", () => {
      const invalidData = {
        body: {
          routeId: "123e4567-e89b-12d3-a456-426614174000",
          dateRoute: "2020-01-01T10:00:00Z", // Past date
          pace: "MARIPOSA",
          meetingPoints: [
            {
              type: "PRIMARY",
              name: "Explanada",
            },
          ],
        },
      };

      const result = createRouteCallSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("future");
      }
    });

    it("should reject route call without primary meeting point", () => {
      const invalidData = {
        body: {
          routeId: "123e4567-e89b-12d3-a456-426614174000",
          dateRoute: "2026-12-25T10:00:00Z",
          pace: "MARIPOSA",
          meetingPoints: [
            {
              type: "SECONDARY", // No PRIMARY
              name: "Test",
            },
          ],
        },
      };

      const result = createRouteCallSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject non-Google Maps URL", () => {
      const invalidData = {
        body: {
          routeId: "123e4567-e89b-12d3-a456-426614174000",
          dateRoute: "2026-12-25T10:00:00Z",
          pace: "MARIPOSA",
          meetingPoints: [
            {
              type: "PRIMARY",
              name: "Explanada",
              location: "https://wikipedia.org", // Not Google Maps
            },
          ],
        },
      };

      const result = createRouteCallSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Google Maps");
      }
    });
  });

  describe("getRouteCallsSchema", () => {
    it("should validate pagination parameters", () => {
      const validData = {
        query: {
          page: "1",
          limit: "20",
        },
      };

      const result = getRouteCallsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid page number", () => {
      const invalidData = {
        query: {
          page: "0", // Invalid: must be >= 1
          limit: "20",
        },
      };

      const result = getRouteCallsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject limit over 100", () => {
      const invalidData = {
        query: {
          page: "1",
          limit: "150", // Invalid: max is 100
        },
      };

      const result = getRouteCallsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
