// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 1,
  workers: 1,           // serial — avoids hammering the Wix CDN
  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/reports/html', open: 'never' }],
    ['json', { outputFile: 'tests/reports/results.json' }],
  ],

  use: {
    // Desktop viewport matching Wix's default breakpoint
    viewport: { width: 1440, height: 900 },
    // Give Wix's JS time to render
    navigationTimeout: 45_000,
    actionTimeout: 15_000,
    screenshot: 'only-on-failure',
    // Slow down slightly so Wix animations settle
    launchOptions: { slowMo: 0 },
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } },
    },
  ],

  // Local dev server for our custom site
  webServer: {
    command: 'npx serve . --listen 3333 --no-clipboard',
    url: 'http://localhost:3333',
    reuseExistingServer: true,
    timeout: 10_000,
  },
});
