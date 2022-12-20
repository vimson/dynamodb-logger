module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@helpers/(.*)': '<rootDir>/src/helpers/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@libs/(.*)': '<rootDir>/src/libs/$1',
    '@tests/(.*)': '<rootDir>/src/tests/$1',
  },
};
