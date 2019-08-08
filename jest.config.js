module.exports = {
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: '<rootDir>/test/coverage',
  collectCoverageFrom: ['src/**.ts']
}
