import { BASE_URL } from "@/env";
import { createRouter } from "@nanostores/router";

export const $router = createRouter({
  machine_login: `${BASE_URL}machine`, // Login with machine
  start_page: `${BASE_URL}`,
  interlock: `${BASE_URL}interlock`,
  users: `${BASE_URL}users`,
  budgetCodes: `${BASE_URL}budgets`,
  machines: `${BASE_URL}machines`,
  kiosk: `${BASE_URL}kiosk`,
  lostConnectionPage: `${BASE_URL}interlock-login/lost-connection`,
  interlockLogin: `${BASE_URL}interlock-login`,
  financial_statements: `${BASE_URL}statements`,
  timer: `${BASE_URL}timer`,
  machineIssues: `${BASE_URL}issues`,
  reportForm: `${BASE_URL}form/:userId/:machineId`,
  errorPage: `${BASE_URL}/404`,
  userDashboard: `${BASE_URL}user-dashboard`,
  userDashboardMachinesStatus: `${BASE_URL}user-dashboard/machines-status`,
  userDashboardUserStats: `${BASE_URL}user-dashboard/user-stats`,
});

export type kioskRoutes = "users" | "budgetCodes" | "machines" | "statements" | "machineIssues"
export type userDashboardRoutes = "userDashboardUserStats" | "userDashboardMachinesStatus" | "userDashboard"