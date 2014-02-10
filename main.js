;(function(dom) {

  ///////////////////////////////////////////////
  //                   vars                    //
  ///////////////////////////////////////////////

  var htmlStrings = {
        tooltip: '<span class="ratio tooltip" title="Half module: 0.5, Single module: 1, Double module: 2, etc">Ratio<input></span>',
        noTooltip : '<span class="ratio">Ratio<input></span>'
      }, 
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

  //helper function
  function addHandlers(btn) {
    //add module functionality
    btn.addEventListener('click', function() {
      var node = this.parentElement.children[1];
      var modulesElm = templates.module();
      node.appendChild(modulesElm);
    });

  }

  addHandlers(dom.querySelector('.level button'));

  ///////////////////////////////////////////////
  //                Functions                  //
  ///////////////////////////////////////////////

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

  //DOM parser
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
              pcnt = parseFloat(module.querySelector('.percentage input').value, 10) || 0;

          if(pcnt) {
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

  function parseModules(modules) {
    var total = 0, totalWeight = 0;

    modules.forEach(function(mod) {
      totalWeight += mod.weight;
      total += (mod.percentage * mod.weight);
    });

    //return the average
    return (Math.round((total / totalWeight) * 100) / 100);

  }

  function isValid(levels) {
    //all the weights <= 100
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

  function updateLvlResults(elem, avg, weighted) {
    var elem = elem.querySelector(".results"),
        avgElm = elem.querySelector(".avg"),
        weightElm = elem.querySelector(".weight");

      avgElm.innerHTML = avg+"%";
      weightElm.innerHTML = weighted+"%";
  }
  
  function updateScore(score) {
    score = Math.round(score * 100) / 100;
    var scoreElm = dom.getElementById('Score'),
        leftPos = ((scoreElm.scrollWidth / 100) * score);

    scoreElm.querySelector('.marker').style.left =  leftPos-1.5 +'px';
    scoreElm.querySelector('.value').innerHTML = score+'%';

  }

})(document);
