import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import request from "supertest";
import express, { Application } from "express";
import {
  getTestPrisma,
  cleanDatabase,
  disconnectTestPrisma,
} from "../helpers/test-db";
import {
  createTestRoute,
  createTestUser,
  generateFutureDate,
} from "../helpers/test-helpers";
import { routeCallsRouter } from "../../modules";

describe.skip("Route Calls Integration Tests", () => {
  let app: Application;
  let prisma: any;
  let testRoute: any;
  let testUser: any;

  beforeAll(async () => {
    // Setup Express app for testing
    app = express();
    app.use(express.json());
    app.use("/api/route-calls", routeCallsRouter);

    // Get Prisma client
    prisma = getTestPrisma();
  });

  beforeEach(async () => {
    // Clean database before each test
    await cleanDatabase();

    // Create test data
    testRoute = await createTestRoute(prisma);
    testUser = await createTestUser(prisma);
  });

  afterAll(async () => {
    await cleanDatabase();
    await disconnectTestPrisma();
  });

  describe("GET /api/route-calls", () => {
    it("should return empty array when no route calls exist", async () => {
      const response = await request(app).get("/api/route-calls").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.totalCount).toBe(0);
    });

    it("should return paginated route calls", async () => {
      // Create test route calls
      await prisma.routeCall.create({
        data: {
          routeId: testRoute.id,
          organizerId: testUser.id,
          title: "Test Route Call 1",
          image: testRoute.image,
          dateRoute: generateFutureDate(7),
          pace: "MARIPOSA",
          status: "SCHEDULED",
        },
      });

      await prisma.routeCall.create({
        data: {
          routeId: testRoute.id,
          organizerId: testUser.id,
          title: "Test Route Call 2",
          image: testRoute.image,
          dateRoute: generateFutureDate(14),
          pace: "GUSANO",
          status: "SCHEDULED",
        },
      });

      const response = await request(app)
        .get("/api/route-calls?page=1&limit=10")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.totalCount).toBe(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });

    it("should filter route calls by status", async () => {
      // Create scheduled route call
      await prisma.routeCall.create({
        data: {
          routeId: testRoute.id,
          organizerId: testUser.id,
          title: "Scheduled Call",
          image: testRoute.image,
          dateRoute: generateFutureDate(7),
          pace: "MARIPOSA",
          status: "SCHEDULED",
        },
      });

      // Create cancelled route call
      await prisma.routeCall.create({
        data: {
          routeId: testRoute.id,
          organizerId: testUser.id,
          title: "Cancelled Call",
          image: testRoute.image,
          dateRoute: generateFutureDate(14),
          pace: "GUSANO",
          status: "CANCELLED",
        },
      });

      const response = await request(app)
        .get("/api/route-calls?status=SCHEDULED")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe("SCHEDULED");
    });

    it("should respect pagination limits", async () => {
      // Create 5 route calls
      for (let i = 1; i <= 5; i++) {
        await prisma.routeCall.create({
          data: {
            routeId: testRoute.id,
            organizerId: testUser.id,
            title: `Route Call ${i}`,
            image: testRoute.image,
            dateRoute: generateFutureDate(i),
            pace: "MARIPOSA",
            status: "SCHEDULED",
          },
        });
      }

      // Request page 1 with limit 2
      const response = await request(app)
        .get("/api/route-calls?page=1&limit=2")
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.totalCount).toBe(5);
      expect(response.body.pagination.totalPages).toBe(3);
      expect(response.body.pagination.hasNextPage).toBe(true);
      expect(response.body.pagination.hasPreviousPage).toBe(false);
    });

    it("should validate invalid pagination parameters", async () => {
      const response = await request(app)
        .get("/api/route-calls?page=0&limit=200")
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
