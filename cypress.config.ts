import { defineConfig } from 'cypress';

export default defineConfig({
  screenshotOnRunFailure: false,
  video: false,
  videoUploadOnPasses: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    env: {
      DATABASE_URL: ':memory:',
    }
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
