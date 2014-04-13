module.exports = {

  zeroModules: {
    expectedResult: 0,
    years: [{
      worth: 100,
      modules: [{
        weight: 100,
        percentage: 0
      }]
    }]
  },

  lotsOfModules: {
    expectedResult: 50,
    years:[{
      worth: 100,
      modules: [
        {
          percentage: 0,
        },
        {
          percentage: 10
        },
        {
          percentage: 20
        },
        {
          percentage: 30,
        },
        {
          percentage: 40
        },
        {
          percentage: 50
        },
        {
          percentage: 60
        },
        {
          percentage: 70
        },
        {
          percentage: 80
        },
        {
          percentage: 90
        },
        {
          percentage: 100
        }
      ]
    }]
  },

  //TODO - rename
  oneYear: {
    expectedResult: 75,
    years: [{
      worth: 100,
      modules: [
        {
          weight: 1,
          percentage: 75
        }
      ]
    }]
  }
};