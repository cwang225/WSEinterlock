import { Hono } from "hono";
import { financialStatementRoutes } from "../../api-files/routes/financialStatements.js";
import { userRoutes } from "../../api-files/routes/users.js";
import { db } from "../../api-files/db/index.js";
import {
  users,
  budgetCodes,
  machines,
  machineTypes,
  financialStatementsTable,
} from "../../api-files/db/schema.js";
import { eq } from "drizzle-orm";
import { Context } from "../../api-files/lib/context.js";
import { auth } from "../../api-files/middleware/auth.js";
import { emailRoutes } from "../../api-files/routes/emails.js";



async function adminLogin(app: Hono<Context>): Promise<string> {
  const adminCardNum = "1234567890777777";
  const response = await app.request(`/users/${adminCardNum}`);
  if (response.status !== 200) {
    throw new Error("Admin login failed");
  }
  const setCookie = response.headers.get("set-cookie") || "";
  return setCookie.split(";")[0];
}



// Generate a unique 15‑digit card number to be deleted later
function generateTestCardNumber(): string {
  const randomPart = Math.floor(Math.random() * 1e13)
    .toString()
    .padStart(13, "0");
 
  return "999" + randomPart;
}

//app setup
const app = new Hono<Context>();
app.use("/*", auth);
app.route("/", userRoutes);
app.route("/", financialStatementRoutes);
app.route("/", emailRoutes);
app.onError((err, c) => {
  return c.json(
    { message: err instanceof Error ? err.message : "Internal Server Error" },
    (err as any)?.status || 400
  );
});

//global test vars
let adminCookie: string = "";
let testUserId: number;
let testBudgetCodeId: number;
let dummyMachineTypeId: number;
let testMachineId: number;
let testFinStatementId: number;

// setup for testing
beforeAll(async () => {
  // Log in as admin.
  adminCookie = await adminLogin(app);

  // Create a test user.
  const testUserCard = "999000000000002";
  const [insertedUser] = await db
    .insert(users)
    .values({
      name: "Test Financial User",
      cardNum: testUserCard,
      lastDigitOfCardNum: parseInt(testUserCard.slice(-1)),
      JHED: "finuser",
      isAdmin: 0,
      graduationYear: 2025,
      active: 1,
    })
    .returning();
  testUserId = insertedUser.id;

  //Create a test budget code.
  const randomBudgetName =
    "TEST_BUDGET_" +
    Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
  const randomBudgetCode =
    Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
  const [insertedBudget] = await db
    .insert(budgetCodes)
    .values({
      name: randomBudgetName,
      code: randomBudgetCode,
    })
    .returning();
  testBudgetCodeId = insertedBudget.id;

  //Insert a dummy machine type.
  const [insertedType] = await db
    .insert(machineTypes)
    .values({ name: "DUMMY_MACHINE_TYPE" })
    .returning();
  dummyMachineTypeId = insertedType.id;

  //create a test machine using the dummy machine type.
  const [insertedMachine] = await db
    .insert(machines)
    .values({
      name:
        "TEST_MACHINE_" +
        Math.floor(Math.random() * 1e8).toString().padStart(8, "0"),
      hourlyRate: 50,
      machineTypeId: dummyMachineTypeId,
    })
    .returning();
  testMachineId = insertedMachine.id;
});


// tests 


describe("Financial Statement Routes", () => {
  describe("GET /fin-statements", () => {
    test("returns 200 and a list of financial statements with pagination (admin access)", async () => {
      const [insertedStatement] = await db
        .insert(financialStatementsTable)
        .values({
          userId: testUserId,
          budgetCode: testBudgetCodeId,
          machineId: testMachineId,
          dateAdded: new Date(1000), // Create a Date object for 1000 ms
          timeSpent: 2000,
        })
        .returning();
      testFinStatementId = insertedStatement.id;

      const response = await app.request(
        "/fin-statements?page=1&limit=20&sort=type_asc",
        { method: "GET", headers: { Cookie: adminCookie } }
      );
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("data");
      expect(Array.isArray(body.data)).toBe(true);
      expect(body).toHaveProperty("meta");
      expect(body.meta).toHaveProperty("page", 1);
      expect(body.meta).toHaveProperty("limit", 20);
      expect(body).toHaveProperty("message", "Fetched Financial Statements");
    });

    test("returns 401 Unauthorized when no session is provided", async () => {
      const response = await app.request(
        "/fin-statements?page=1&limit=20&sort=type_asc",
        { method: "GET" }
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("POST /fin-statements", () => {
    test("creates a new financial statement (admin access)", async () => {
      const newStatement = {
        userId: testUserId,
        budgetCode: testBudgetCodeId,
        machineId: testMachineId,
        timeSpent: 4000,
      };
      const response = await app.request("/fin-statements", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(newStatement),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("message", "Created new financial statement code");
      expect(body).toHaveProperty("data");
      // Verify that the returned record maps correctly:
      expect(body.data.userId).toBe(newStatement.userId);
      expect(body.data.budgetCode).toBe(newStatement.budgetCode);
      expect(body.data.machineId).toBe(newStatement.machineId);
      expect(body.data).toHaveProperty("dateAdded");
      expect(body.data.timeSpent).toBe(newStatement.timeSpent);
    });

    test("returns 401 Unauthorized when no session is provided", async () => {
      const newStatement = {
        userId: testUserId,
        budgetCode: testBudgetCodeId,
        machineId: testMachineId,
        dateAdded: new Date(3000),
        timeSpent: 4000,
      };
      const response = await app.request("/fin-statements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatement),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });

    test("returns 403 Forbidden when non-admin session is used", async () => {
        const testCardNum = generateTestCardNumber();
        const nonAdminUser = {
          name: "Non Admin",
          cardNum: testCardNum,
          JHED: "nonadmin",
          isAdmin: 0,
          graduationYear: 2025,
        };
        // Create non-admin user using admin access.
        await app.request('/users', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json', Cookie: adminCookie }),
          body: JSON.stringify(nonAdminUser),
        });
        // Simulate non-admin login.
        const nonAdminLoginResponse = await app.request(`/users/${nonAdminUser.cardNum}`, {
          headers: new Headers({ Cookie: adminCookie })
        });
        const nonAdminCookie = nonAdminLoginResponse.headers.get("set-cookie")?.split(";")[0] || "";
      const newStatement = {
        userId: testUserId,
        budgetCode: testBudgetCodeId,
        machineId: testMachineId,
        dateAdded: new Date(5000),
        timeSpent: 6000,
      };
      const response = await app.request("/fin-statements", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: nonAdminCookie },
        body: JSON.stringify(newStatement),
      });
      expect(response.status).toBe(403);
      const bodyRes = await response.json();
      expect(bodyRes).toHaveProperty("message", "Forbidden: Admins only");
    });
  });

  describe("POST /statement-email", () => {
    test("returns 200 and a list of financial statements with pagination (admin access)", async () => {
      const response = await app.request("/statement-email/wseinterlocks@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify({
          startDate: "2025-01-01",
          endDate: (new Date()).toLocaleDateString(),
        }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("message", "Successfully sent an email");
    });
  });
});

//cleanup db
afterAll(async () => {
    await db
      .delete(financialStatementsTable)
      .where(eq(financialStatementsTable.userId, testUserId))
      .execute();
    await db.delete(machines).where(eq(machines.id, testMachineId)).execute();
    await db.delete(machineTypes).where(eq(machineTypes.id, dummyMachineTypeId)).execute();
    await db.delete(users).where(eq(users.id, testUserId)).execute();
    await db.delete(budgetCodes).where(eq(budgetCodes.id, testBudgetCodeId)).execute();
    await (db.$client as any).end();
  });