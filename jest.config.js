module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['json', 'html', 'text'],
  setupFiles: ['./test/dotenv-config.js'],
};
