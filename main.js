;(function(dom) {

  ///////////////////////////////////////////////
  //                   vars                    //
  ///////////////////////////////////////////////

  var htmlStrings = {
        tooltip: '<span class="ratio tooltip" title="Half module: 0.5, Single module: 1, Double module: 2, etc">Ratio<input></span>',
        noTooltip : '<span class="ratio">Ratio<input></span>'
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

          return function() {
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
  //              Event Handlers               //
  ///////////////////////////////////////////////

  dom.getElementById("Add-Level").addEventListener('click', function() {
    var html = templates.level();
    dom.getElementById("Levels").appendChild(html);
  });

  dom.getElementById("Calculate").addEventListener('click', function() {
    window.scrollTo(0);
    calculate(parseLevels());
  });

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
              pcnt = parseFloat(module.querySelector('.percentage input').value, 10);

          if(!isNaN(pcnt)) {
            level.modules.push({
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
  

})(document);
