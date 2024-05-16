module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    moduleFileExtensions: ['js', 'jsx'],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
  };