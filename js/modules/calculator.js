module.exports.calculate = function(years) {
  var finalResult = 0;
  var yearsResults = [];
  
  years.forEach(function(yr, i) {
    var weightedResult = (Math.round(((yr.weight / 100) * yr.average) * 100) / 100);

    yearsResults.push({
      average: yr.average,
      contributes: weightedResult
    });
    
    finalResult += weightedResult;
  });

  return {
    overall: finalResult,
    years: yearsResults
  };

};
