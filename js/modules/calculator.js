module.exports.calculate = function(years) {
  var finalResult = 0;

  years.forEach(function(year) {
    finalResult += year.contributes = (Math.round(((year.weight / 100) * year.average) * 100) / 100);
  });

  return {
    overall: finalResult,
    years: years
  };
};
