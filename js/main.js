//acts as a mediator - main entry point for browserify
var polyfills = require('./modules/polyfills')();
var view = require('./view');
var calculator = require('./modules/calculator');
var validator = require('./modules/validator');
var LS = require('./modules/localStorage');

(function init() {
  if(LS.isAvailable()) {
    if(LS.get()) {
      view.showOpenButton(); //will intern call the hide on save button
    } else {
      view.showSaveButton();
    }
  }
  //register click listeners
  view.setButtonListener('calculate', calculateClicked);
  view.setButtonListener('save', saveClicked);
  view.setButtonListener('open', openClicked);
  view.init();
})();

function calculateClicked() {
  view.clearErrors();
  var data = view.getInputData();
  if(!validator.validate(data)) {
    return view.showError("Check each years <em>worth</em> percentages, something isn't quite right.");
  }
  view.updateScore(calculator.calculate(data));
}

function saveClicked() {
  var data = view.prepForSave();
  if(data.length) LS.set(data);
}

function openClicked() {
  view.setInputData(LS.get());
}
