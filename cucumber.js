const os = require("os");
const process = require("process");

module.exports = {
  default: {
    require: [
      'tests/steps/*.ts',
      'support/*.ts',
    ],
    requireModule: ['ts-node/register'],
    format: [
      'allure-cucumberjs/reporter',
      'progress'
    ],
    formatOptions: {
      'allure-cucumberjs/reporter': {
        resultsDir: './allure-results',
        labels: [
          {
            pattern: [/@epic:(.*)/],
            name: 'epic',
          },
          {
            pattern: [/@severity:(.*)/],
            name: 'severity',
          },
        ],
        links: {
          issue: {
            pattern: [/@issue:(.*)/],
            urlTemplate: 'https://issues.example.com/%s',
            nameTemplate: 'ISSUE %s',
          },
          tms: {
            pattern: [/@tms:(.*)/],
            urlTemplate: 'https://tms.example.com/%s',
          },
          jira: {
            pattern: [/@jira:(.*)/],
            urlTemplate: (v) => `https://jira.example.com/browse/${v}`,
          },
        },
        categories: [
          {
            name: 'Assertion Errors',
            messageRegex: '.*AssertionError.*',
            matchedStatuses: ['failed'],
          },
        ],
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          node_version: process.version,
        },
      }
    },
    paths: ['tests/features/*.feature'],
  }
};
