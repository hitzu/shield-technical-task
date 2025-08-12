module.exports = {
  collectCoverageFrom: [
    '**/*.ts',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/docs/**'
  ],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  roots: ['<rootDir>/'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/src/tests/setup.ts'
  ],
  verbose: true,
  silent: true
};
