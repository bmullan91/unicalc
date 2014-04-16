module.exports = {

  greaterThan100: {
    expectedResult: 0,
    years: [
      {
        worth: 50,
        modules: [
          {
            percentage: 75
          }
        ]
      },
      {
        worth: 51,
        modules: [
          {
            percentage: 67
          }
        ]
      }
    ]
  },

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

  complex: {
    expectedResult: 70,
    years: [
      {
        worth: 30,
        modules: [
          {
            weight: 1, 
            percentage: 53
          },
          {
            weight: 2,
            percentage: 67
          },
          {
            weight: 3,
            percentage: 80
          }
        ]
      },
      {
        worth: 70,
        modules: [
          {
            weight: 1,
            percentage: 78
          },
          {
            weight: 2,
            percentage: 63
          },
          {
            weight: 3,
            percentage: 71
          }
        ]
      }
    ]
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