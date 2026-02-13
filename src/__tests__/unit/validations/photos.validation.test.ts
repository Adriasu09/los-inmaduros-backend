import { describe, it, expect } from "@jest/globals";
import { getPhotosSchema } from "../../../modules/photos/photos.validation";

describe("Photos Validation", () => {
  describe("getPhotosSchema - Pagination", () => {
    it("should validate valid pagination parameters", () => {
      const validData = {
        query: {
          page: "1",
          limit: "20",
        },
      };

      const result = getPhotosSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject page number less than 1", () => {
      const invalidData = {
        query: {
          page: "0",
          limit: "20",
        },
      };

      const result = getPhotosSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject limit over 100", () => {
      const invalidData = {
        query: {
          page: "1",
          limit: "150",
        },
      };

      const result = getPhotosSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept valid UUID for routeId", () => {
      const validData = {
        query: {
          routeId: "123e4567-e89b-12d3-a456-426614174000",
        },
      };

      const result = getPhotosSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid UUID for routeId", () => {
      const invalidData = {
        query: {
          routeId: "not-a-uuid",
        },
      };

      const result = getPhotosSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should validate photo context enum", () => {
      const validData = {
        query: {
          context: "ROUTE_GALLERY",
        },
      };

      const result = getPhotosSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid photo context", () => {
      const invalidData = {
        query: {
          context: "INVALID_CONTEXT",
        },
      };

      const result = getPhotosSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
