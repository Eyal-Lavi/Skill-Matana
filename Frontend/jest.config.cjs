module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  testMatch: [
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.test.jsx',
  ],
  clearMocks: true,
  restoreMocks: true,
};
