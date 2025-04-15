module.exports = {
    default: {
      require: [
        'tests/steps/*.ts',
        'support/*.ts'
      ],
      requireModule: ['ts-node/register'],
      format: ['allure-cucumberjs/reporter', 'progress'],
      paths: ['tests/features/*.feature'],
    },
  };
  