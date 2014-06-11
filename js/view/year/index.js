//YearComponent simple factory
var hogan = require('hogan.js');
var template = hogan.compile(require('./template'));
var ModuleComponent = require('../module');

//the class
function YearComponent(number, noModules) {
  this.number = number;
  this.element = createElem(number);
  this.modules = [];
  if(!noModules) this.addModule();
}

YearComponent.prototype.getElement = function() {
  return this.element;
};

YearComponent.prototype.getModules = function() {
  return this.modules;
};

YearComponent.prototype.addButtonListener = function() {
  this.element.querySelector('button').addEventListener('click', this.addModule.bind(this));
};

YearComponent.prototype.addModule = function(moduleConfig) {
  var moduleComponent = ModuleComponent.create(moduleConfig);
  this.modules.push(moduleComponent);
  this.element.querySelector('.modules').appendChild(moduleComponent.getElement());
};

YearComponent.prototype.getAverage = function() {
  var total = 0;
  var totalWeight = 0;

  this.modules.forEach(function(module) {
    var pcent = module.getPercentage();

    if(!isNaN(pcent)) {
      var weight = module.getWeight();
      totalWeight += weight;
      total += (pcent * weight);
    }

  });
  //return the average
  return (Math.round((total / totalWeight) * 100) / 100);
};

YearComponent.prototype.getWeight = function() {
  return parseFloat(this.element.querySelector('.year-weight input').value, 10);
};

YearComponent.prototype.setWeight = function(value) {
  this.element.querySelector('.year-weight input').value = value;
};

YearComponent.prototype.setResults = function(average, weighted) {
  var resultsElem = this.element.querySelector(".results");
  var avgElm = resultsElem.querySelector(".avg");
  var weightElm = resultsElem.querySelector(".weight");

  avgElm.innerHTML = average+"%";
  weightElm.innerHTML = weighted+"%";
};

YearComponent.prototype.getSaveData = function() {
  var yearWeight = this.getWeight();
  if(isNaN(yearWeight)) return;

  var modules = [];

  this.getModules().forEach(function (mod) {
    var pcent = mod.getPercentage();
    var weight = mod.getWeight();

    if(!isNaN(pcent) && !isNaN(weight)) {
      modules.push({
        name: mod.getName(),
        percentage: pcent,
        weight: weight
      });
    }

  });

  return {
    weight: yearWeight,
    modules: modules
  };

};

function createElem(number) {
  var tempContainer = document.createElement('div');
  tempContainer.innerHTML = template.render({year: number});
  return tempContainer.firstChild;
}

module.exports = {
  create: function(number, noModules) {
    var yearCmp = new YearComponent(number, noModules);
    //phantomjs was playing up, delaying call until object is instantiated.
    yearCmp.addButtonListener();
    return yearCmp;
  }
};
