(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./modules/events').init();
require('./modules/localStorage').init();

},{"./modules/events":5,"./modules/localStorage":6}],2:[function(require,module,exports){
module.exports.calculate = function(lvls) {

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

  return finalResult;

  //updateScore(finalResult)
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
    DOM_ELMS.errors.weights.style.display = "none";
    return true;
  } else {
    DOM_ELMS.errors.weights.style.display = "block";
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




},{}],3:[function(require,module,exports){
//Private stuff..

var scoreMeterContainer = document.getElementById('Score'),
		errorsContainer = document.getElementById('Errors');


module.exports = {

  levelsContainer: document.getElementById('Levels'),

  buttons: {
    save: document.getElementById('Save'),
    retrieve: document.getElementById('Retrieve'),
    addLevel: document.getElementById('Add-Level'),
    calculate: document.getElementById("Calculate")
  },
  
  errors: {
    weights: errorsContainer.querySelector('.weights')
  }

};
},{}],4:[function(require,module,exports){
/*
DOM parser, this builds the levels array
used by the calculate function.
*/
module.exports.parseLevels = function() {

  var lvlsArray = document.querySelectorAll('.level'),
      levels = [];

  for(var i = 0, l = lvlsArray.length; i < l; i++) {

    var elem = lvlsArray[i],
        level = { weight: 0, modules : [] };

      level.weight = parseFloat(elem.querySelector('.level-weight input').value, 10) || 0;

      if(!level.weight) { continue; }

      var modules = elem.querySelectorAll('.module');

      for(var j = 0, k = modules.length; j < k; j++) {
        var module = modules[j],
            wght = parseFloat(module.querySelector('.ratio input').value, 10) || 1,
            pcnt = parseFloat(module.querySelector('.percentage input').value, 10),
            name = module.querySelector('.name input').value;

        if(!isNaN(pcnt)) {
          level.modules.push({
            name: name,
            weight: wght,
            percentage: pcnt
          });
        }

      }

      if(level.modules.length > 0) {
        levels.push(level);
      }

  }

  //return array
  return levels;

}

  /*
    This manages building and inserting the results 
    information prevoiusly stored by a user.
  */
module.exports.restorePrev = function(lvls) {

    var levelsDomElm = DOM_ELMS.levelsContainer;

    lvls.forEach(function(level, i) {

      //level element - create one if needed
      var levelElm = levelsDomElm.children[i] || templates.level(),
          modulesElm = levelElm.querySelector('.modules'),
          existingModules = modulesElm.querySelectorAll('.module');

      //1st update its 'worth' input
      levelElm.querySelector('.level-weight input').value = level.weight;
      
      //2nd create each module element
      level.modules.forEach(function(module, i) {

        var modulesIndex = 1,
            moduleElm = existingModules[i] || templates.module();
        
        //3rd update each field
        moduleElm.querySelector('.name input').value = module.name || "";
        moduleElm.querySelector('.percentage input').value = module.percentage || "";
        moduleElm.querySelector('.ratio input').value = module.weight || "";
        
        //finally append the module element
        modulesElm.appendChild(moduleElm);

      });

      //insert level into the DOM
      levelsDomElm.appendChild(levelElm);
    });

  }
},{}],5:[function(require,module,exports){
var DOM_ELMS = require('./domCache'),
		LS = require('./localStorage'),
		calculator = require('./calculator'),
		domParser = require('./domParser');


module.exports.init = function() {

	//Event Handlers
  LS.DOM_ELMS.saveBtn.addEventListener('click', function() {
    LS.store(domParser.parseLevels());
    //change the button to 'Saved!' with a different colour
    var btn = LS.DOM_ELMS.saveBtn;

    btn.innerHTML = 'Saved!';
    btn.classList.add('btn-green');

    setTimeout(function() {
      btn.innerHTML = 'Save Results';
      btn.classList.remove('btn-green');
    }, 500);

  });

  LS.DOM_ELMS.retrieveBtn.addEventListener('click', function() {
    domParser.restorePrev(LS.retrieve());
    //update the button back to 'save'
    LS.DOM_ELMS.retrieveBtn.style.display = "none";
    LS.DOM_ELMS.saveBtn.style.display = "block";
  });

  DOM_ELMS.buttons.addLevel.addEventListener('click', function() {
    var html = templates.level();
    DOM_ELMS.levelsContainer.appendChild(html);
  });

  DOM_ELMS.buttons.calculate.addEventListener('click', function() {
		window.scrollTo(0);
  	var result = calculator.calculate(domParser.parseLevels());
  	require('./scoreMeter').update(result);
  });

  addHandler(document.querySelector('.level button'));

};

module.exports.addBtnHandler = addHandler;

/*
  This handles attaching the click handler to the
  'Add Module' button for each level.
*/
function addHandler(btn) {
  //add module functionality
  btn.addEventListener('click', function() {
    var node = this.parentElement.children[1];
    var modulesElm = templates.module();
    node.appendChild(modulesElm);
  });

}

},{"./calculator":2,"./domCache":3,"./domParser":4,"./localStorage":6,"./scoreMeter":7}],6:[function(require,module,exports){
var KEY = 'RESULTS_DATA',
    cache = null,
    DOM_ELMS = {
    	saveBtn: document.getElementById('Save'),
    	retrieveBtn: document.getElementById('Retrieve')
    },
    get = function() {
    	if(cache) { return cache; }
  		return (cache = JSON.parse(window.localStorage.getItem(KEY))); //we can get away with this.
    },
    set = function(data) {
    	cache = data;
  		window.localStorage.setItem(KEY, JSON.stringify(data));
    };

module.exports = {

	init: function() {
	  if(window.localStorage) {
	    if(get()) {
	      DOM_ELMS.retrieveBtn.style.display = "block";
	    } else {
	      DOM_ELMS.saveBtn.style.display = "block";
	    }
	  }
	},
	DOM_ELMS: DOM_ELMS,
	store: set,
	retrieve: get

};

},{}],7:[function(require,module,exports){
var container = document.getElementById('Score'),
		marker = container.querySelector('.marker'),
    value =container.querySelector('.value');

module.exports.update = function(score) {

	score = Math.round(score * 100) / 100;
  var leftPos = ((DOM_ELMS.scoreMeter.container.scrollWidth / 100) * score);

  DOM_ELMS.scoreMeter.marker.style.left =  leftPos-1.5 +'px';
  DOM_ELMS.scoreMeter.value.innerHTML = score+'%';

};
},{}]},{},[1])