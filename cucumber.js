module.exports = {
    default: {
      require: [
        'tests/steps/*.ts',
        'support/*.ts'
      ],
      requireModule: ['ts-node/register'],
      format: ['@shelex/cucumberjs-allure2-reporter', 'progress'],
      // paths: ['tests/features/B'],
    },
  };
  