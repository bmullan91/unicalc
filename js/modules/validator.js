module.exports = {
  validate: function(years) {
    if(!years.length) return false;
    
    var totalWeight = years.reduce(function(total, year) {
      return total += year.weight;
    }, 0);

    return (totalWeight > 0 && totalWeight <= 100);
  }
};