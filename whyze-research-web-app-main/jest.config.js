module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>src/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: ['node_modules/(?!axios)'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    axios: 'axios/dist/node/axios.cjs',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
