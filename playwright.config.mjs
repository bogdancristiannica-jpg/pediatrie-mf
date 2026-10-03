// Teste cap-la-cap pe trei motoare: Chromium (Chrome Windows/Mac), WebKit (motorul Safari) și emulare iPhone pe WebKit.
// Local, dacă nu ai WebKit instalat: `npm run test:e2e:chromium`. În CI rulează toate.
import { defineConfig, devices } from "@playwright/test";

const port = 4173;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: `http://localhost:${port}/`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run build && npm run serve",
    url: `http://localhost:${port}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 850 } } },
    { name: "webkit", use: { ...devices["Desktop Safari"], viewport: { width: 1366, height: 850 } } },
    { name: "iphone-webkit", use: { ...devices["iPhone 15 Pro"] } },
    { name: "iphone-chromium", use: { ...devices["iPhone 15 Pro"], defaultBrowserType: "chromium" } },
  ],
});
