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