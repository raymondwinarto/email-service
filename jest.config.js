module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/index.js'],
  coverageReporters: ['json', 'html', 'text'],
  setupFiles: ['./test/dotenv-config.js'],
};
