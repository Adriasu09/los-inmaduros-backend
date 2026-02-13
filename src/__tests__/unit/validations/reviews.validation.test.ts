import { describe, it, expect } from "@jest/globals";
import { getRouteReviewsSchema } from "../../../modules/reviews/reviews.validation";

describe("Reviews Validation", () => {
  describe("getRouteReviewsSchema - Pagination", () => {
    it("should validate valid pagination parameters", () => {
      const validData = {
        params: {
          routeId: "123e4567-e89b-12d3-a456-426614174000",
        },
        query: {
          page: "1",
          limit: "20",
        },
      };

      const result = getRouteReviewsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid routeId UUID", () => {
      const invalidData = {
        params: {
          routeId: "not-a-uuid",
        },
        query: {
          page: "1",
          limit: "20",
        },
      };

      const result = getRouteReviewsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept valid pagination without params", () => {
      const validData = {
        params: {
          routeId: "123e4567-e89b-12d3-a456-426614174000",
        },
        query: {},
      };

      const result = getRouteReviewsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject page less than 1", () => {
      const invalidData = {
        params: {
          routeId: "123e4567-e89b-12d3-a456-426614174000",
        },
        query: {
          page: "0",
        },
      };

      const result = getRouteReviewsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject limit over 100", () => {
      const invalidData = {
        params: {
          routeId: "123e4567-e89b-12d3-a456-426614174000",
        },
        query: {
          limit: "200",
        },
      };

      const result = getRouteReviewsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
