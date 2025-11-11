module.exports = {
  testMatch: ['**/tests/**/*.test.js'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  clearMocks: true,
  restoreMocks: true,
};
