module.exports = {
  validate: function(years) {

    if(!years.length) return false;

    var totalWeight = 0;

    years.forEach(function(year) {
      totalWeight += year.weight;
    });

    return (totalWeight > 0 && totalWeight <= 100);
  

  }
};