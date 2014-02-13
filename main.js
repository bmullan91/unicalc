;(function(dom, win) {

  ///////////////////////////////////////////////
  //                   vars                    //
  ///////////////////////////////////////////////

  var htmlStrings = {
        tooltip: '<span class="ratio tooltip" title="Half module: 0.5, Single module: 1, Double module: 2, etc">Ratio<input></span>',
        noTooltip : '<span class="ratio">Ratio<input></span>'
      },
      //cache reusable DOM elements
      DOM_ELMS = {
        buttons: {
          save: dom.getElementById('Save'),
          retrieve: dom.getElementById('Retrieve'),
          addLevel: dom.getElementById('Add-Level'),
          calculate: dom.getElementById("Calculate")
        }
      },

      //Score-o-meter
      updateScore = (function() {
        var elem = dom.getElementById('Score'),
            markerElm = elem.querySelector('.marker'),
            valueElm = elem.querySelector('.value'),
            width = elem.scrollWidth;

        return function(score) {
            score = Math.round(score * 100) / 100;
            var leftPos = ((width / 100) * score);

            markerElm.style.left =  leftPos-1.5 +'px';
            valueElm.innerHTML = score+'%';
        };

      }()),

      LS = (function() {

        if(!window.localStorage) { return null; }

        var KEY = 'RESULTS_DATA',
            cache = null;

        return {

          store: function(data) {
            cache = data;
            win.localStorage.setItem(KEY, JSON.stringify(data));
          },

          retrieve: function() {
            if(cache) { return cache; }
            return (cache = JSON.parse(win.localStorage.getItem(KEY))); //we can get away with this.
          }

        };


      } ()),

      //templates
      templates = {
        module: (function() {
            var htmlStr = dom.querySelector('.module').innerHTML;
            
            htmlStr = htmlStr.replace(htmlStrings.tooltip, htmlStrings.noTooltip);

            return function() {
              var doc = dom.createElement('div');

              doc.innerHTML = htmlStr;
              doc.className = 'module';
              return doc;
            };
          }()),
        level: (function() {
          var i = 1,
              htmlStr = dom.querySelector(".level").innerHTML;

          htmlStr = htmlStr.replace(htmlStrings.tooltip, htmlStrings.noTooltip);

          return function(year) {
            if(year) { i = year; }

            var level = "Year "+(++i),
                doc = dom.createElement('div'),
                newHtml = htmlStr.replace("Year 1", level);

            doc.className = "level lvl";
            doc.innerHTML = newHtml;

            addHandlers(doc.children[2]);
            return doc;
          }; 
        }())
      };

  ///////////////////////////////////////////////
  //                init code                  //
  ///////////////////////////////////////////////
  (function() {

    //Event Handlers
    DOM_ELMS.buttons.save.addEventListener('click', function() {
      LS.store(parseLevels());
      //change the button to 'Saved!' with a different colour
      var btn = dom.getElementById('Save');

      btn.innerHTML = 'Saved!';
      btn.classList.add('btn-green');

      setTimeout(function() {
        btn.innerHTML = 'Save';
        btn.classList.remove('btn-green');
      }, 500);

    });

    DOM_ELMS.buttons.retrieve.addEventListener('click', function() {
      restorePrev(LS.retrieve());
      //update the button back to 'save'
      dom.getElementById('Retrieve').style.display = "none";
      dom.getElementById('Save').style.display = "block";

    });

    DOM_ELMS.buttons.addLevel.addEventListener('click', function() {
      var html = templates.level();
      dom.getElementById('Levels').appendChild(html);
    });

    DOM_ELMS.buttons.calculate.addEventListener('click', function() {
      window.scrollTo(0);
      var levels = parseLevels();
      LS.store(levels);
      calculate(levels);
    });

    //check if the user has stored results
    if(LS) {

      if(LS.retrieve()) {
        DOM_ELMS.buttons.retrieve.style.display = "block";
      } else {
        DOM_ELMS.buttons.save.style.display = "block";
      }

    }

  }());

  /*
    This handles attaching the click handler to the
    'Add Module' button for each level.
  */
  function addHandlers(btn) {
    //add module functionality
    btn.addEventListener('click', function() {
      var node = this.parentElement.children[1];
      var modulesElm = templates.module();
      node.appendChild(modulesElm);
    });

  }

  //attach the handler to level 1
  addHandlers(dom.querySelector('.level button'));

  ///////////////////////////////////////////////
  //                Functions                  //
  ///////////////////////////////////////////////

  function restorePrev(lvls) {

    var levelsDomElm = dom.getElementById('Levels');

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
  

  /*
    The core calculate function, which takes the 
    levels array from parseLevels() function 
    working out their weighted average and updating
    their elements. Passing the final result to 
    updateScore().

    @param lvls {Array} An array of level objects
    @example

    [
      {
        weight: 20, //worth %
        modules: [
          {
            weight: 1,
            percentage: 50
          },
          {
            weight: 2,
            percentage: 75
          }
        ]

      },
      {
        //another level..
      }
    ]

  */
  function calculate(lvls) {

    var finalResults = [],
        levelElms = dom.querySelectorAll('.level');

    if(!isValid(lvls)) { return; }
    
    lvls.forEach(function(lvl, i) {
      
      //get its weight
      var levelWeight = lvl.weight
          moduleAvg = parseModules(lvl.modules),
          weightedResult = (Math.round(((levelWeight / 100) * moduleAvg) * 100) / 100);
      
      finalResults.push(weightedResult);
      updateLvlResults(levelElms[i], moduleAvg, weightedResult);
      
    });
    
    var finalResult = 0;
    finalResults.forEach(function(x) {
      finalResult += x;
    });
    
    //fin.
    updateScore(finalResult)
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
      dom.querySelector("#Errors .weights").style.display = "none";
      return true;
    } else {
      dom.querySelector("#Errors .weights").style.display = "block";
      return false;
    } 
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

  /*
  DOM parser, this builds the levels array
  used by the calculate function.
  */
  function parseLevels() {

    var lvlsArray = dom.querySelectorAll('.level'),
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
  

})(document, window);
