module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: ['default', 'jest-junit'],
  testResultsProcessor: 'jest-junit',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json'
    }
  },
  collectCoverageFrom: ['src/**/*.ts']
}
