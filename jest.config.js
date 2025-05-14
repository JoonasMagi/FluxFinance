export default {
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library)/)'
  ],
  // Focus only on our project
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  // Ignore other projects
  watchPathIgnorePatterns: ['<rootDir>/node_modules'],
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  // Use a unique name for the cache
  cacheDirectory: '<rootDir>/.jest-cache'
};
