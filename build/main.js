(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//main entry point for browserify

require('./modules/events').init();
require('./modules/localStorage').init();

},{"./modules/events":4,"./modules/localStorage":5}],2:[function(require,module,exports){
var domParser    = require('./domParser'),
    scoreMeter   = require('./scoreMeter'),
    weightsError = document.querySelector('#Errors .weights');

/*
  The main purpose of a calculator is to calculate stuff, 
  this one is no different.

  - This validates the data - ensuring the weights for all levels is valid
  - Calculates each years average and weighted average, and updates the DOM with its results
  - Tallys each levels result and updates the score-o-meter

*/
module.exports.calculate = function(lvls) {

  lvls = lvls || domParser.parseLevels();

  var finalResult = 0,
      levelElms = document.querySelectorAll('.level');

  if(!isValid(lvls)) { return; }
  
  lvls.forEach(function(lvl, i) {
    //get its weight
    var moduleAvg = parseModules(lvl.modules),
        weightedResult = (Math.round(((lvl.weight / 100) * moduleAvg) * 100) / 100);
    
    updateLvlResults(levelElms[i], moduleAvg, weightedResult);
    finalResult += weightedResult;
  });
  
  //fin.
  scoreMeter.update(finalResult);
};

//////////////////////////////////////////
//          Private stuff               //
//////////////////////////////////////////

/*
  Helper function used by calculate, checks that
  the total weights for all levels is >0 && <=100
*/
function isValid(levels) {
  var totalWeight = 0;

  levels.forEach(function(level) {
    totalWeight += level.weight;
  });

  if(totalWeight > 0 && totalWeight <= 100) {
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




},{"./domParser":3,"./scoreMeter":6}],3:[function(require,module,exports){
var templates = require('./templates'),
    levelsContainer = document.getElementById('Levels'),
    parseModules = function(modules) {
      var returnArr = [];

      for(var i = 0, j = modules.length; i < j; i++) {
        var module = modules[i],
            wght = parseFloat(module.querySelector('.ratio input').value, 10) || 1,
            pcnt = parseFloat(module.querySelector('.percentage input').value, 10),
            name = module.querySelector('.name input').value;

        if(!isNaN(pcnt)) {
          returnArr.push({
            name: name,
            weight: wght,
            percentage: pcnt
          });
        }

      }

      return returnArr;

    };

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

      //lets figure out if there is any actual module data
      var lvlModules = parseModules(elem.querySelectorAll('.module')); 

      if(lvlModules.length > 0) {
        level.modules = lvlModules;
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

    lvls.forEach(function(level, i) {

      //level element - create one if needed
      var levelElm = levelsContainer.children[i] || templates.level(),
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
      levelsContainer.appendChild(levelElm);
    });

  }
},{"./templates":7}],4:[function(require,module,exports){
var calculator = require('./calculator'),
    templates  = require('./templates');

module.exports.init = function() {
  document.getElementById('Add-Level').addEventListener('click', function() {
    var html = templates.level();
    document.getElementById('Levels').appendChild(html);
  });

  //Should we move this into the calculator?
  document.getElementById("Calculate").addEventListener('click', function() {
		window.scrollTo(0, 0);
  	calculator.calculate();
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

},{"./calculator":2,"./templates":7}],5:[function(require,module,exports){
var domParser  = require('./domParser'),
    calculator = require('./calculator'),
    KEY = 'RESULTS_DATA',
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
    },
    addEventHandlers = function() {
      //Event Handlers
      DOM_ELMS.saveBtn.addEventListener('click', function() {
        set(domParser.parseLevels());
        //change the button to 'Saved!' with a different colour
        var btn = DOM_ELMS.saveBtn;

        btn.innerHTML = 'Saved!';
        btn.classList.add('btn-green');

        setTimeout(function() {
          btn.innerHTML = 'Save Results';
          btn.classList.remove('btn-green');
        }, 500);

      });

      DOM_ELMS.retrieveBtn.addEventListener('click', function() {
        var results = get();
        domParser.restorePrev(results);
        //recall calculate
        calculator.calculate(results);
        //update the button back to 'save'
        DOM_ELMS.retrieveBtn.style.display = "none";
        DOM_ELMS.saveBtn.style.display = "block";
      });

    };

//Expose the API
module.exports = {

  init: function() {
    if(window.localStorage) {
      addEventHandlers();
      if(get()) {
        DOM_ELMS.retrieveBtn.style.display = "block";
      } else {
        DOM_ELMS.saveBtn.style.display = "block";
      }
    }
  },
  store: set,
  retrieve: get
};

},{"./calculator":2,"./domParser":3}],6:[function(require,module,exports){
var container = document.getElementById('Score'),
		marker    = container.querySelector('.marker'),
    value     = container.querySelector('.value'),
    width     = container.scrollWidth;

module.exports.update = function(score) {
	score = Math.round(score * 100) / 100;
  var leftPos = ((width / 100) * score);

  marker.style.left =  leftPos-1.5 +'px';
  value.innerHTML = score+'%';
};
},{}],7:[function(require,module,exports){
var events = require('./events'),
    htmlStrings = {
      tooltip: '<span class="ratio tooltip" title="Half module: 0.5, Single module: 1, Double module: 2, etc">Weight<input></span>',
      noTooltip : '<span class="ratio">Weight<input></span>'
    };

module.exports = {
  module: (function() {
      var htmlStr = document.querySelector('.module').innerHTML;
      
      htmlStr = htmlStr.replace(htmlStrings.tooltip, htmlStrings.noTooltip);

      return function() {
        var doc = document.createElement('div');
        doc.innerHTML = htmlStr;
        doc.className = 'module';
        return doc;
      };

    }()),

  level: (function() {
    var i = 1,
        htmlStr = document.querySelector(".level").innerHTML;

    htmlStr = htmlStr.replace(htmlStrings.tooltip, htmlStrings.noTooltip);

    return function() {
      var level = "Year "+(++i),
          doc = document.createElement('div'),
          newHtml = htmlStr.replace("Year 1", level);

      doc.className = "level lvl";
      doc.innerHTML = newHtml;
      events.addBtnHandler(doc.children[2]);
      return doc;
    }; 
  }())
};
},{"./events":4}]},{},[1])