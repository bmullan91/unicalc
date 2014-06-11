//ModuleComponent simple factory
var hogan = require('hogan.js');
var template = hogan.compile(require('./template'));

//the class
function ModuleComponent(config) {
  config = config || {};
  this.element = createElem();
  if(config.name !== undefined) this.setName(config.name);
  if(config.percentage !== undefined) this.setPercentage(config.percentage);
  if(config.weight !== undefined) this.setWeight(config.weight);
}

ModuleComponent.prototype.getElement = function() {
  return this.element;
};

ModuleComponent.prototype.getName = function() {
  return this.element.querySelector('.name input').value;
};

ModuleComponent.prototype.setName = function(value) {
  this.element.querySelector('.name input').value = value;
};

ModuleComponent.prototype.getWeight = function() {
  return parseFloat(this.element.querySelector('.ratio input').value, 10) || 1
};

ModuleComponent.prototype.setWeight = function(value) {
  this.element.querySelector('.ratio input').value = value;
};

ModuleComponent.prototype.getPercentage = function() {
  return parseFloat(this.element.querySelector('.percentage input').value, 10);
};

ModuleComponent.prototype.setPercentage = function(value) {
  this.element.querySelector('.percentage input').value = value;
};

ModuleComponent.prototype.applyTooltip = function() {
  this.element.querySelector('.ratio').className += ' tooltip';
};

function createElem() {
  var tempContainer = document.createElement('div');
  tempContainer.innerHTML = template.render();
  return tempContainer.firstChild;
}

module.exports = {
  create: function(config) {
    return new ModuleComponent(config);
  }
};
