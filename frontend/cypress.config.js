const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Set this to the URL your frontend runs on
    viewportWidth: 1280,
    viewportHeight: 720,
    supportFile: 'cypress/support/e2e.js',
    screenshotOnRunFailure: false, // Disable screenshots on test failure
  },
});

