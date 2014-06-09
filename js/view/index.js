//The only module which will touch the DOM
var templates = require('./templates');
var DOM_ELEMS = {
  yearsContainer: document.getElementById('Years'),
  errors: document.getElementById('Errors'),
  score: document.getElementById('Score'),
  marker: document.querySelector('#Score .marker'),
  value: document.querySelector('#Score .marker .value'),
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
  //register all click listeners
  DOM_ELEMS.btns.calculate.addEventListener('click', calculateClicked);
  DOM_ELEMS.btns.save.addEventListener('click', saveClicked);
  DOM_ELEMS.btns.open.addEventListener('click', openClicked);
  //Add year listener
  DOM_ELEMS.btns.addYear.addEventListener('click', addYearClicked);
  //add module listener
  addModuleListener(DOM_ELEMS.yearsContainer.children[0]);
}

//////////////////////////////////////
//        Click handlers            //
//////////////////////////////////////

function calculateClicked() {
  //mediator does its thing first
  if(mediatorListeners.calculate) mediatorListeners.calculate();
  //do we nede to do anyting else?
  DOM_ELEMS.btns.open.style.display = "none";
  DOM_ELEMS.btns.save.style.display = "block";
}

function saveClicked() {
  var btn = DOM_ELEMS.btns.save;
  var previousHtml = btn.innerHTML;

  //mediator does its thing first
  if(mediatorListeners.save) mediatorListeners.save();
  //do we nede to do anyting else?
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
  //do we nede to do anyting else?
  calculateClicked();
}

function addYearClicked() {
  var yearElem = templates.year();
  addModuleListener(yearElem);
  document.getElementById('Years').appendChild(yearElem);
}

function addModuleListener(yearElem) {
  yearElem.querySelector('button').addEventListener('click', function() {
    var node = this.parentElement.children[1];
    var modulesElm = templates.module();
    node.appendChild(modulesElm);
  });
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
  //button should be 'calculate', 'save' or 'open'
  mediatorListeners[button] = fn;
}

function getInputData() {
  var yrsArray = document.querySelectorAll('.year'),
      years = [];

  for(var i = 0, l = yrsArray.length; i < l; i++) {

    var elem = yrsArray[i],
        year = { weight: 0, modules : [] };

      year.weight = parseFloat(elem.querySelector('.year-weight input').value, 10) || 0;

      if(!year.weight) { continue; }

      //lets figure out if there is any actual module data
      var yearModules = parseModules(elem.querySelectorAll('.module')); 

      if(yearModules.length > 0) {
        year.modules = yearModules;
        years.push(year);
      }
  }

  //return array
  return years;

  //helper fn
  function parseModules(modules) {
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
  }


}

function setInputData(years) {
  //clear years
  for(var i = 0, l = DOM_ELEMS.yearsContainer.children.length; i < l; i++) {
    DOM_ELEMS.yearsContainer.removeChild(DOM_ELEMS.yearsContainer.children[i]);
  }

  years.forEach(function(year, i) {

    //year element - create one if needed
    var yearElem = templates.year(),
        modulesElm = yearElem.querySelector('.modules'),
        existingModules = modulesElm.querySelectorAll('.module');

    //1st update its 'worth' input
    yearElem.querySelector('.year-weight input').value = year.weight;
    
    //2nd create each module element
    year.modules.forEach(function(module, i) {

      var modulesIndex = 1,
          moduleElm = existingModules[i] || templates.module();
      
      //3rd update each field
      moduleElm.querySelector('.name input').value = module.name || "";
      moduleElm.querySelector('.percentage input').value = module.percentage || "";
      moduleElm.querySelector('.ratio input').value = module.weight || "";
      
      //finally append the module element
      modulesElm.appendChild(moduleElm);

    });

    //insert year into the DOM
    DOM_ELEMS.yearsContainer.appendChild(yearElem);
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

function updateScore() {
  //TODO
}