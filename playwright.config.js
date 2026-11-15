import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const BASE_PATH = '/diba-digital-postcards/';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}${BASE_PATH}`,
    trace: 'on-first-retry',
    // CI installs Playwright's own Chromium (`npx playwright install`). Setting
    // CHROME_BIN points the run at a system Chrome instead, for environments
    // where the bundled download is not reachable.
    launchOptions: process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {},
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    // `vite preview` serves the real production bundle the way Pages does.
    // The build is invoked through `node` directly, matching the workaround the
    // deploy workflow uses on runners where `npm run` cannot spawn vite.
    command: `node node_modules/vite/bin/vite.js build && npx vite preview --port ${PORT} --strictPort --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}${BASE_PATH}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
