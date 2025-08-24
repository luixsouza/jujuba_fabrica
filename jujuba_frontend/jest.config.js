module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
