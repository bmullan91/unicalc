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
