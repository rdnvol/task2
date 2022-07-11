import { defineConfig } from 'cypress';

const cypressEnv = require('./cypress/plugins/cypress-dotenv')

export default defineConfig({
  env: {
    productsUrl: '/products'
  },
  e2e: {
    setupNodeEvents(on, config) {
      return cypressEnv(on, config)
    },
  },
});
