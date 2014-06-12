var YearComponent = require('./year');
var ModuleComponent = require('./module');
var scoreMeter = require('./scoreMeter');

var yearComponents = [];
var DOM_ELEMS = {
  yearsContainer: document.getElementById('Years'),
  errors: document.getElementById('Errors'),
  footer: document.getElementById('Footer'),
  btns: {
    calculate: document.getElementById('Calculate'),
    save: document.getElementById('Save'),
    open: document.getElementById('Open'),
    addYear: document.getElementById('Add-Year')
  }
};
var mediatorListeners = {
  calculate: null,
  save: null,
  open: null
};

function init() {
  //create and insert a year component..
  addYearClicked();
  addToolTip();

  if(window.ANDROID) {
    DOM_ELEMS.footer.style.display = "none";
  }

  //register all click listeners
  DOM_ELEMS.btns.calculate.addEventListener('click', calculateClicked);
  DOM_ELEMS.btns.save.addEventListener('click', saveClicked);
  DOM_ELEMS.btns.open.addEventListener('click', openClicked);
  //Add year listener
  DOM_ELEMS.btns.addYear.addEventListener('click', addYearClicked);
}

//////////////////////////////////////
//        Click handlers            //
//////////////////////////////////////

function calculateClicked() {
  window.scrollTo(0, 0);
  //mediator does its thing first
  if(mediatorListeners.calculate) mediatorListeners.calculate();
  //do we need to do anyting else?
  DOM_ELEMS.btns.open.style.display = "none";
  DOM_ELEMS.btns.save.style.display = "block";

}

function saveClicked() {
  var btn = DOM_ELEMS.btns.save;
  var previousHtml = btn.innerHTML;

  //mediator does its thing first
  if(mediatorListeners.save) mediatorListeners.save();
  //do we need to do anyting else?
  btn.innerHTML = 'Saved!';
  btn.classList.add('icon-ok');

  setTimeout(function() {
    btn.innerHTML = previousHtml;
    btn.classList.remove('icon-ok');
  }, 700);
}

function openClicked() {
  //mediator does its thing first
  if(mediatorListeners.open) mediatorListeners.open();
  //do we need to do anyting else?
  calculateClicked();
}

function addYearClicked() {
  var currentNumOfYrs = DOM_ELEMS.yearsContainer.children.length;
  var yearComponent = YearComponent.create(currentNumOfYrs+1);

  yearComponents.push(yearComponent);
  DOM_ELEMS.yearsContainer.appendChild(yearComponent.getElement());
}

function addToolTip() {
  //This should only appear on the first module of the first year.
  var firstYear = yearComponents[0];
  if(firstYear) {
    var mod = firstYear.getModules()[0];
    if(mod) {
      mod.applyTooltip();
    }
  }
}

//////////////////////////////////////
//            View API              //
//////////////////////////////////////

module.exports = {
  init: init,
  setButtonListener: setButtonListener,
  showOpenButton: showOpenButton,
  showSaveButton: showSaveButton,
  getInputData: getInputData,
  setInputData: setInputData,
  prepForSave: prepForSave,
  clearErrors: clearErrors,
  showError: showError,
  updateScore: updateScore
};

function showOpenButton() {
  DOM_ELEMS.btns.save.style.display = "none";
  DOM_ELEMS.btns.open.style.display = "block";
}

function showSaveButton() {
  DOM_ELEMS.btns.open.style.display = "none";
  DOM_ELEMS.btns.save.style.display = "block";
}

function setButtonListener(button, fn) {
  //button should be one of 'calculate', 'save' or 'open'
  mediatorListeners[button] = fn;
}

function prepForSave() {
  var data = [];

  yearComponents.forEach(function (yrCmp) {
    var yearDetails = yrCmp.getSaveData();
    if(yearDetails) data.push(yearDetails);
  });

  return data;
}

function getInputData() {
  var data = [];

  yearComponents.forEach(function (yearCmp) {
    var avg = yearCmp.getAverage();
    var weight = yearCmp.getWeight();

    if(!isNaN(avg) && !isNaN(weight)) {
      data.push({
        average: avg,
        weight: weight
      });
    }
  });
  /*
    [{
        average: XX%,
        weight:   XX%
      }]
  */
  return data;
}

function setInputData(years) {
  //clear years
  for(var i = 0, l = yearComponents.length; i < l; i++) {
    DOM_ELEMS.yearsContainer.removeChild(yearComponents[i].getElement());
  }

  yearComponents = [];

  years.forEach(function(year, i) {
    if(!year) return;

    var yrCmp = YearComponent.create(i+1, true);
    yearComponents.push(yrCmp);
    yrCmp.setWeight(year.weight);

    year.modules.forEach(function (mod) {
      yrCmp.addModule(mod);
    });

    DOM_ELEMS.yearsContainer.appendChild(yrCmp.getElement());
  });
}

function clearErrors() {
  for(var i = 0, l = DOM_ELEMS.errors.children.length; i < l; i++) {
    DOM_ELEMS.errors.removeChild(DOM_ELEMS.errors.children[i]);
  }
}

function showError(errorMsg) {
  var doc = document.createElement('div');
  doc.innerHTML = errorMsg;
  DOM_ELEMS.errors.appendChild(doc);
}


function updateScore(results) {
  yearComponents.forEach(function (yrCmp, i) {
    var yr = results.years[i];
    if(yr) {
      yrCmp.setResults(yr.average, yr.contributes);
    }
  });
  scoreMeter.update(results.overall);
}
