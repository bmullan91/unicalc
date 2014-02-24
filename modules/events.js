var DOM_ELMS = require('./domCache'),
		LS = require('./localStorage'),
		calculator = require('./calculator'),
		domParser = require('./domParser');


module.exports.init = function() {
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
