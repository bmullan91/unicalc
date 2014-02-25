var domParser = require('./domParser'),
    scoreMeter = require('./scoreMeter'),
    weightsError = document.querySelector('#Errors .weights');

module.exports.calculate = function(lvls) {

  lvls = lvls || domParser.parseLevels();

  var finalResults = [],
      levelElms = document.querySelectorAll('.level');

  if(!isValid(lvls)) { return; }
  
  lvls.forEach(function(lvl, i) {
    
    //get its weight
    var levelWeight = lvl.weight
        moduleAvg = parseModules(lvl.modules),
        weightedResult = (Math.round(((levelWeight / 100) * moduleAvg) * 100) / 100);
    
    finalResults.push(weightedResult);
    updateLvlResults(levelElms[i], moduleAvg, weightedResult);
    
  });

  //TODO - refactor - remove remove extra loop
  
  var finalResult = 0;
  finalResults.forEach(function(x) {
    finalResult += x;
  });
  
  //fin.
  scoreMeter.update(finalResult);
};

//TODO - use the final result to update the score - updateScore();


//Private stuff..

/*
  Helper function used by calculate, checks that
  the total weights for all levels is less than
  100.

  TODO - error msg when weights are 0
*/
function isValid(levels) {
  var totalWeight = 0;

  levels.forEach(function(level) {
    totalWeight += level.weight;
  });

  if(totalWeight >= 0 && totalWeight <= 100) {
    weightsError.style.display = "none";
    return true;
  } else {
    weightsError.style.display = "block";
    return false;
  } 
}

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


//TODO - should move

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



