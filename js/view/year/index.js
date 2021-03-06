//YearComponent simple factory
var hogan = require('hogan.js');
var domify = require('domify');
var simpleFactory = require('simple-factory');
var template = hogan.compile(require('./template'));
var ModuleComponent = require('../module');

function YearComponent(config) {
  config = config || {};
  this.number = config.number;
  this.modules = [];
  this.element = domify(template.render({year: this.number}));

  if(config.weight) {
    this.setWeight(config.weight);
  }

  if(config.modules) {
    config.modules.forEach(this.addModule.bind(this));
  }

  this.addButtonListener();
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

  var modules = this.getModules().map(function(mod) {
    var pcent = mod.getPercentage();
    var weight = mod.getWeight();

    if(!isNaN(pcent) && !isNaN(weight)) {
      return {
        name: mod.getName(),
        percentage: pcent,
        weight: weight
      };
    }

  });

  return {
    number: this.number,
    weight: yearWeight,
    modules: modules
  };
};

module.exports.create = simpleFactory(YearComponent);
