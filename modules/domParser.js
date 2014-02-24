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