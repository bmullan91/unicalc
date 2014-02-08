;(function(doc) {

  var templates = {
    module: (function() {
        var node = document.querySelector('.module').cloneNode(true);
        return function() {
          return node;
        };
      }()),
    level: (function() {

      var i = 1,
          elem = document.querySelector(".level"),
          node = elem.cloneNode(true);
      return function() {
        var level = "Level "+(++i);
        node.querySelector(".level-title").innerHTML = level;
        addHandlers(node.children[2]);
        return node;
      }; 
    }())
  };


  function addHandlers(btn) {
    //add module functionality

    btn.addEventListener('click', function() {
      var node = this.parentElement.children[1];
      var modulesElm = templates.module();
      node.appendChild(modulesElm);
    });

  }

  addHandlers(document.querySelector('.level button'));


  $("#Add-Level").click(function() {
    var html = templates.level();
    $("#Levels").append(html);
  });

  $("#calc").click(function() {

    //grab all the levels and make it into a lovely array.
    var lvlsArray = $('.level'),
        levels = [];

      for(var i = 0, l = lvlsArray.length; i < l; i++) {

        var elem = lvlsArray[i],
            level = { weight: 0, modules : [] };

          level.weight = parseInt($(elem).find(".level-weight :input").val(), 10) || 0;

          if(!level.weight) { continue; }

          var modules = $(elem).find('.module');

          for(var j = 0, k = modules.length; j < k; j++) {
            var $module = $(modules[j]),
                wght = parseInt($module.find('.weight :input').val(), 10) || 1,
                pcnt = parseInt($module.find('.percent :input').val(), 10) || 0;

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

      calculate(levels);

  });



  function calculate(lvls) {

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
    
    var finalResult = 0;
    finalResults.forEach(function(x) {
      finalResult += x;
    });
    
    //fin.
    updateScore(finalResult)
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
      document.querySelector("#Errors .weights").style.display = "none";
      return true;
    } else {
      document.querySelector("#Errors .weights").style.display = "block";
      return false;
    } 
  }

  function updateLvlResults(elem, avg, weighted) {
    var elem = elem.querySelector(".results"),
        avgElm = elem.querySelector(".avg"),
        weightElm = elem.querySelector(".weight");

      avgElm.innerHTML = avg;
      weightElm.innerHTML = weighted;
  }


  function updateScore(score) {

    score = Math.round(score * 100) / 100;

    var $score = $("#Score"),
        $marker = $score.find(".marker"),
        $value = $score.find(".value");

    var leftPos = (($score.width() / 100) * score);

    $marker.css('left', leftPos-1.5);
    $value.css('left', leftPos-10);
    $value.html(score+"%");

  }

})(document);
