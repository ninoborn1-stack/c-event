import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 4317);

export default defineConfig({
  testDir: './e2e',
  // Alle Tests teilen sich eine Demo-Ablage, deshalb nacheinander.
  workers: 1,
  fullyParallel: false,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `pnpm exec next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
    env: { DATA_MODE: 'demo', DEMO_DATA_DIR: '.demo-data-e2e' },
  },
});
