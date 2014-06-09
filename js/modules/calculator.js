var scoreMeter   = require('./scoreMeter'),
    weightsError = document.querySelector('#Errors .weights');

/*
  The main purpose of a calculator is to calculate stuff, 
  this one is no different.

  - This validates the data - ensuring the weights for all levels is valid
  - Calculates each years average and weighted average, and updates the DOM with its results
  - Tallys each levels result and updates the score-o-meter

*/
module.exports.calculate = function(lvls) {


  //TODO remove updating each years average and weighting


  var finalResult = 0,
      levelElms = document.querySelectorAll('.level');
  
  lvls.forEach(function(lvl, i) {
    //get its weight
    var moduleAvg = parseModules(lvl.modules),
        weightedResult = (Math.round(((lvl.weight / 100) * moduleAvg) * 100) / 100);
    
    //updateLvlResults(levelElms[i], moduleAvg, weightedResult); ****** TODO
    finalResult += weightedResult;
  });
  
  //fin.
  scoreMeter.update(finalResult);
};

//////////////////////////////////////////
//          Private stuff               //
//////////////////////////////////////////

/*
  Helper function used by calculate, deals specfically with the 
  modules array for a given level returning the average 
  of all modules, taking into account their individual 
  weights.
*/
function parseModules(modules) {
  var total = 0, totalWeight = 0;

  modules.forEach(function(mod) {
    totalWeight += mod.weight;
    total += (mod.percentage * mod.weight);
  });

  //return the average
  return (Math.round((total / totalWeight) * 100) / 100);

}

/*
  This function updates each level element with 
  its computed average and corresponding weighted 
  result.
*/
function updateLvlResults(elem, avg, weighted) {
  var elem = elem.querySelector(".results"),
      avgElm = elem.querySelector(".avg"),
      weightElm = elem.querySelector(".weight");

    avgElm.innerHTML = avg+"%";
    weightElm.innerHTML = weighted+"%";
}



