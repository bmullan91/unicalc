(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//acts as a mediator - main entry point for browserify
var polyfills = require('./modules/polyfills')();
var view = require('./view');
var calculator = require('./modules/calculator');
var validator = require('./modules/validator');
var LS = require('./modules/localStorage');

(function init() {

  try {
    window.ANDROID = Android;
  } catch(e) {
    window.ANDROID = null;
  }

  if(LS.isAvailable()) {
    if(LS.get()) {
      view.showOpenButton();
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

},{"./modules/calculator":2,"./modules/localStorage":3,"./modules/polyfills":4,"./modules/validator":5,"./view":6}],2:[function(require,module,exports){
module.exports.calculate = function(years) {
  var finalResult = 0;
  var yearsResults = [];
  
  years.forEach(function(yr, i) {
    var weightedResult = (Math.round(((yr.weight / 100) * yr.average) * 100) / 100);

    yearsResults.push({
      average: yr.average,
      contributes: weightedResult
    });
    
    finalResult += weightedResult;
  });

  return {
    overall: finalResult,
    years: yearsResults
  };

};

},{}],3:[function(require,module,exports){
var KEY = 'RESULTS_DATA';
var cache = null; 
var api = window.ANDROID || window.localStorage || null;

module.exports = {

  isAvailable: function() {
    return api !== null;
  },

  get: function() {
    if(cache) { return cache; }

    try {
      var data = api.getItem(KEY);
      return data ? (cache = JSON.parse(data)) : null;
    } catch (e) {
      console.log("ERROR localStorage.getItem(KEY) "+ e);
      return null;
    }
  },

  set: function(data) {
    cache = data;
    api.setItem(KEY, JSON.stringify(data));
  }
  
};

},{}],4:[function(require,module,exports){
module.exports = function() {
  //https://github.com/ariya/phantomjs/issues/10522
  var isFunction = function(o) {
    return typeof o == 'function';
  };


  var bind,
    slice = [].slice,
    proto = Function.prototype,
    featureMap;

  featureMap = {
    'function-bind': 'bind'
  };

  function has(feature) {
    var prop = featureMap[feature];
    return isFunction(proto[prop]);
  }

  // check for missing features
  if (!has('function-bind')) {
    // adapted from Mozilla Developer Network example at
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
    bind = function bind(obj) {
      var args = slice.call(arguments, 1),
        self = this,
        nop = function() {
        },
        bound = function() {
          return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
        };
      nop.prototype = this.prototype || {}; // Firefox cries sometimes if prototype is undefined
      bound.prototype = new nop();
      return bound;
    };
    proto.bind = bind;
  }

};
},{}],5:[function(require,module,exports){
module.exports = {
  validate: function(years) {
    if(!years.length) return false;
    
    var totalWeight = 0;

    years.forEach(function(year) {
      totalWeight += year.weight;
    });

    return (totalWeight > 0 && totalWeight <= 100);
  }
};
},{}],6:[function(require,module,exports){
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
  var yearComponent = YearComponent.create({ number: DOM_ELEMS.yearsContainer.children.length +1 });
  yearComponents.push(yearComponent);
  yearComponent.addModule();
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
  return yearComponents.map(function (yrCmp) {
    return yrCmp.getSaveData();
  }).filter(Boolean);
}

function getInputData() {
  return yearComponents.map(function (yearCmp) {
    var avg = yearCmp.getAverage();
    var weight = yearCmp.getWeight();

    if(!isNaN(avg) && !isNaN(weight)) {
      return {
        average: avg,
        weight: weight
      };
    }
  }).filter(Boolean);
}

function clearYearComponents() {
  yearComponents.forEach(function(year) {
    DOM_ELEMS.yearsContainer.removeChild(year.getElement());
  });

  yearComponents = [];
}

function setInputData(years) {
  clearYearComponents();

  yearComponents = years.map(YearComponent.create);

  yearComponents.forEach(function(year) {
    DOM_ELEMS.yearsContainer.appendChild(year.getElement());
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
  results.years.forEach(function(yr, i) {
    yearComponents[i].setResults(yr.average, yr.contributes);
  });

  scoreMeter.update(results.overall);
}

},{"./module":7,"./scoreMeter":9,"./year":10}],7:[function(require,module,exports){
//ModuleComponent simple factory
var domify = require('domify');
var simpleFactory = require('simple-factory');
var template = require('./template');

//the class
function ModuleComponent(config) {
  config = config || {};
  this.element = domify(template);
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

module.exports.create = simpleFactory(ModuleComponent);

},{"./template":8,"domify":12,"simple-factory":16}],8:[function(require,module,exports){
module.exports = [
  "<div class='module'>",
    "<div class='name'>Name<input></div>",
    "<div class='values'>",
      "<span class='percentage'>",
        "<span class='label'>Percentage</span>",
        "<span class='icon'>%</span>",
        "<input>",
      "</span>",
      "<span class='ratio' title='Half module: 0.5, Single module: 1, Double module: 2, etc'>Weight<input></span>",
    "</div>",
  "</div>"
].join('');
},{}],9:[function(require,module,exports){
var container = document.getElementById('Score');
var marker = container.querySelector('.marker');
var value = container.querySelector('.value');
var cssProps = ['-webkit-transform', '-moz-transform', '-ms-transform', '-o-transform', 'transform'];

function applyTransform(value) {
  cssProps.forEach(function(prop) {
    marker.style[prop] = 'translateX(' + value + 'px)';
  });
}

module.exports.update = function(score) {
	score = Math.round(score * 100) / 100;
  var leftPos = ((container.scrollWidth / 100) * score);

  applyTransform(leftPos-1.5);
  value.innerHTML = score+'%';
};
},{}],10:[function(require,module,exports){
//YearComponent simple factory
var hogan = require('hogan.js');
var domify = require('domify');
var simpleFactory = require('simple-factory');
var template = hogan.compile(require('./template'));
var ModuleComponent = require('../module');

//the class
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

},{"../module":7,"./template":11,"domify":12,"hogan.js":14,"simple-factory":16}],11:[function(require,module,exports){
module.exports = [
  '<div class="year card animated zoomIn">',
    '<div class="info">',
      '<span class="year-title">Year {{year}}</span>',
      '<span class="year-weight">Worth %<input class=""></span>',
    '</div>',
    '<div class="modules">',
      '<div class="modules-label">',
        '<div class="pull-left">Module(s):</div>',
        '<div class="details">',
          '<div class="details-name pull-left">Name: not required</div>',
          '<div class="pull-right">Weight: default is 1</div>',
        '</div>',
      '</div>',
      '<div class="clear-fix"></div>',
    '</div>',
    '<button class="btn btn-outline btn-small">Add Module</button>',
    '<div class="results">',
      '<span>Average:',
        '<span class="avg box">0%</span>',
      '</span>',
      '<span class="pull-right">Weighted:',
        '<span class="weight box">0%</span>',
      '</span>',
    '</div>',
  '</div>'
].join('');
},{}],12:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var div = document.createElement('div');
// Setup
div.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
// Make sure that link elements get serialized correctly by innerHTML
// This requires a wrapper element in IE
var innerHTMLBug = !div.getElementsByTagName('link').length;
div = undefined;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}],13:[function(require,module,exports){
/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function (Hogan) {
  // Setup regex  assignments
  // remove whitespace according to Mustache spec
  var rIsWhitespace = /\S/,
      rQuot = /\"/g,
      rNewline =  /\n/g,
      rCr = /\r/g,
      rSlash = /\\/g;

  Hogan.tags = {
    '#': 1, '^': 2, '<': 3, '$': 4,
    '/': 5, '!': 6, '>': 7, '=': 8, '_v': 9,
    '{': 10, '&': 11, '_t': 12
  };

  Hogan.scan = function scan(text, delimiters) {
    var len = text.length,
        IN_TEXT = 0,
        IN_TAG_TYPE = 1,
        IN_TAG = 2,
        state = IN_TEXT,
        tagType = null,
        tag = null,
        buf = '',
        tokens = [],
        seenTag = false,
        i = 0,
        lineStart = 0,
        otag = '{{',
        ctag = '}}';

    function addBuf() {
      if (buf.length > 0) {
        tokens.push({tag: '_t', text: new String(buf)});
        buf = '';
      }
    }

    function lineIsWhitespace() {
      var isAllWhitespace = true;
      for (var j = lineStart; j < tokens.length; j++) {
        isAllWhitespace =
          (Hogan.tags[tokens[j].tag] < Hogan.tags['_v']) ||
          (tokens[j].tag == '_t' && tokens[j].text.match(rIsWhitespace) === null);
        if (!isAllWhitespace) {
          return false;
        }
      }

      return isAllWhitespace;
    }

    function filterLine(haveSeenTag, noNewLine) {
      addBuf();

      if (haveSeenTag && lineIsWhitespace()) {
        for (var j = lineStart, next; j < tokens.length; j++) {
          if (tokens[j].text) {
            if ((next = tokens[j+1]) && next.tag == '>') {
              // set indent to token value
              next.indent = tokens[j].text.toString()
            }
            tokens.splice(j, 1);
          }
        }
      } else if (!noNewLine) {
        tokens.push({tag:'\n'});
      }

      seenTag = false;
      lineStart = tokens.length;
    }

    function changeDelimiters(text, index) {
      var close = '=' + ctag,
          closeIndex = text.indexOf(close, index),
          delimiters = trim(
            text.substring(text.indexOf('=', index) + 1, closeIndex)
          ).split(' ');

      otag = delimiters[0];
      ctag = delimiters[delimiters.length - 1];

      return closeIndex + close.length - 1;
    }

    if (delimiters) {
      delimiters = delimiters.split(' ');
      otag = delimiters[0];
      ctag = delimiters[1];
    }

    for (i = 0; i < len; i++) {
      if (state == IN_TEXT) {
        if (tagChange(otag, text, i)) {
          --i;
          addBuf();
          state = IN_TAG_TYPE;
        } else {
          if (text.charAt(i) == '\n') {
            filterLine(seenTag);
          } else {
            buf += text.charAt(i);
          }
        }
      } else if (state == IN_TAG_TYPE) {
        i += otag.length - 1;
        tag = Hogan.tags[text.charAt(i + 1)];
        tagType = tag ? text.charAt(i + 1) : '_v';
        if (tagType == '=') {
          i = changeDelimiters(text, i);
          state = IN_TEXT;
        } else {
          if (tag) {
            i++;
          }
          state = IN_TAG;
        }
        seenTag = i;
      } else {
        if (tagChange(ctag, text, i)) {
          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
                       i: (tagType == '/') ? seenTag - otag.length : i + ctag.length});
          buf = '';
          i += ctag.length - 1;
          state = IN_TEXT;
          if (tagType == '{') {
            if (ctag == '}}') {
              i++;
            } else {
              cleanTripleStache(tokens[tokens.length - 1]);
            }
          }
        } else {
          buf += text.charAt(i);
        }
      }
    }

    filterLine(seenTag, true);

    return tokens;
  }

  function cleanTripleStache(token) {
    if (token.n.substr(token.n.length - 1) === '}') {
      token.n = token.n.substring(0, token.n.length - 1);
    }
  }

  function trim(s) {
    if (s.trim) {
      return s.trim();
    }

    return s.replace(/^\s*|\s*$/g, '');
  }

  function tagChange(tag, text, index) {
    if (text.charAt(index) != tag.charAt(0)) {
      return false;
    }

    for (var i = 1, l = tag.length; i < l; i++) {
      if (text.charAt(index + i) != tag.charAt(i)) {
        return false;
      }
    }

    return true;
  }

  // the tags allowed inside super templates
  var allowedInSuper = {'_t': true, '\n': true, '$': true, '/': true};

  function buildTree(tokens, kind, stack, customTags) {
    var instructions = [],
        opener = null,
        tail = null,
        token = null;

    tail = stack[stack.length - 1];

    while (tokens.length > 0) {
      token = tokens.shift();

      if (tail && tail.tag == '<' && !(token.tag in allowedInSuper)) {
        throw new Error('Illegal content in < super tag.');
      }

      if (Hogan.tags[token.tag] <= Hogan.tags['$'] || isOpener(token, customTags)) {
        stack.push(token);
        token.nodes = buildTree(tokens, token.tag, stack, customTags);
      } else if (token.tag == '/') {
        if (stack.length === 0) {
          throw new Error('Closing tag without opener: /' + token.n);
        }
        opener = stack.pop();
        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
        }
        opener.end = token.i;
        return instructions;
      } else if (token.tag == '\n') {
        token.last = (tokens.length == 0) || (tokens[0].tag == '\n');
      }

      instructions.push(token);
    }

    if (stack.length > 0) {
      throw new Error('missing closing tag: ' + stack.pop().n);
    }

    return instructions;
  }

  function isOpener(token, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].o == token.n) {
        token.tag = '#';
        return true;
      }
    }
  }

  function isCloser(close, open, tags) {
    for (var i = 0, l = tags.length; i < l; i++) {
      if (tags[i].c == close && tags[i].o == open) {
        return true;
      }
    }
  }

  function stringifySubstitutions(obj) {
    var items = [];
    for (var key in obj) {
      items.push('"' + esc(key) + '": function(c,p,t,i) {' + obj[key] + '}');
    }
    return "{ " + items.join(",") + " }";
  }

  function stringifyPartials(codeObj) {
    var partials = [];
    for (var key in codeObj.partials) {
      partials.push('"' + esc(key) + '":{name:"' + esc(codeObj.partials[key].name) + '", ' + stringifyPartials(codeObj.partials[key]) + "}");
    }
    return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
  }

  Hogan.stringify = function(codeObj, text, options) {
    return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) +  "}";
  }

  var serialNo = 0;
  Hogan.generate = function(tree, text, options) {
    serialNo = 0;
    var context = { code: '', subs: {}, partials: {} };
    Hogan.walk(tree, context);

    if (options.asString) {
      return this.stringify(context, text, options);
    }

    return this.makeTemplate(context, text, options);
  }

  Hogan.wrapMain = function(code) {
    return 'var t=this;t.b(i=i||"");' + code + 'return t.fl();';
  }

  Hogan.template = Hogan.Template;

  Hogan.makeTemplate = function(codeObj, text, options) {
    var template = this.makePartials(codeObj);
    template.code = new Function('c', 'p', 'i', this.wrapMain(codeObj.code));
    return new this.template(template, text, this, options);
  }

  Hogan.makePartials = function(codeObj) {
    var key, template = {subs: {}, partials: codeObj.partials, name: codeObj.name};
    for (key in template.partials) {
      template.partials[key] = this.makePartials(template.partials[key]);
    }
    for (key in codeObj.subs) {
      template.subs[key] = new Function('c', 'p', 't', 'i', codeObj.subs[key]);
    }
    return template;
  }

  function esc(s) {
    return s.replace(rSlash, '\\\\')
            .replace(rQuot, '\\\"')
            .replace(rNewline, '\\n')
            .replace(rCr, '\\r');
  }

  function chooseMethod(s) {
    return (~s.indexOf('.')) ? 'd' : 'f';
  }

  function createPartial(node, context) {
    var prefix = "<" + (context.prefix || "");
    var sym = prefix + node.n + serialNo++;
    context.partials[sym] = {name: node.n, partials: {}};
    context.code += 't.b(t.rp("' +  esc(sym) + '",c,p,"' + (node.indent || '') + '"));';
    return sym;
  }

  Hogan.codegen = {
    '#': function(node, context) {
      context.code += 'if(t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),' +
                      'c,p,0,' + node.i + ',' + node.end + ',"' + node.otag + " " + node.ctag + '")){' +
                      't.rs(c,p,' + 'function(c,p,t){';
      Hogan.walk(node.nodes, context);
      context.code += '});c.pop();}';
    },

    '^': function(node, context) {
      context.code += 'if(!t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
      Hogan.walk(node.nodes, context);
      context.code += '};';
    },

    '>': createPartial,
    '<': function(node, context) {
      var ctx = {partials: {}, code: '', subs: {}, inPartial: true};
      Hogan.walk(node.nodes, ctx);
      var template = context.partials[createPartial(node, context)];
      template.subs = ctx.subs;
      template.partials = ctx.partials;
    },

    '$': function(node, context) {
      var ctx = {subs: {}, code: '', partials: context.partials, prefix: node.n};
      Hogan.walk(node.nodes, ctx);
      context.subs[node.n] = ctx.code;
      if (!context.inPartial) {
        context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
      }
    },

    '\n': function(node, context) {
      context.code += write('"\\n"' + (node.last ? '' : ' + i'));
    },

    '_v': function(node, context) {
      context.code += 't.b(t.v(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
    },

    '_t': function(node, context) {
      context.code += write('"' + esc(node.text) + '"');
    },

    '{': tripleStache,

    '&': tripleStache
  }

  function tripleStache(node, context) {
    context.code += 't.b(t.t(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
  }

  function write(s) {
    return 't.b(' + s + ');';
  }

  Hogan.walk = function(nodelist, context) {
    var func;
    for (var i = 0, l = nodelist.length; i < l; i++) {
      func = Hogan.codegen[nodelist[i].tag];
      func && func(nodelist[i], context);
    }
    return context;
  }

  Hogan.parse = function(tokens, text, options) {
    options = options || {};
    return buildTree(tokens, '', [], options.sectionTags || []);
  }

  Hogan.cache = {};

  Hogan.cacheKey = function(text, options) {
    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join('||');
  }

  Hogan.compile = function(text, options) {
    options = options || {};
    var key = Hogan.cacheKey(text, options);
    var template = this.cache[key];

    if (template) {
      var partials = template.partials;
      for (var name in partials) {
        delete partials[name].instance;
      }
      return template;
    }

    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
    return this.cache[key] = template;
  }
})(typeof exports !== 'undefined' ? exports : Hogan);

},{}],14:[function(require,module,exports){
/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// This file is for use with Node.js. See dist/ for browser files.

var Hogan = require('./compiler');
Hogan.Template = require('./template').Template;
Hogan.template = Hogan.Template;
module.exports = Hogan;

},{"./compiler":13,"./template":15}],15:[function(require,module,exports){
/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var Hogan = {};

(function (Hogan) {
  Hogan.Template = function (codeObj, text, compiler, options) {
    codeObj = codeObj || {};
    this.r = codeObj.code || this.r;
    this.c = compiler;
    this.options = options || {};
    this.text = text || '';
    this.partials = codeObj.partials || {};
    this.subs = codeObj.subs || {};
    this.buf = '';
  }

  Hogan.Template.prototype = {
    // render: replaced by generated code.
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    // render internal -- a hook for overrides that catches partials too
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    // ensurePartial
    ep: function(symbol, partials) {
      var partial = this.partials[symbol];

      // check to see that if we've instantiated this partial before
      var template = partials[partial.name];
      if (partial.instance && partial.base == template) {
        return partial.instance;
      }

      if (typeof template == 'string') {
        if (!this.c) {
          throw new Error("No compiler available.");
        }
        template = this.c.compile(template, this.options);
      }

      if (!template) {
        return null;
      }

      // We use this to check whether the partials dictionary has changed
      this.partials[symbol].base = template;

      if (partial.subs) {
        // Make sure we consider parent template now
        if (!partials.stackText) partials.stackText = {};
        for (key in partial.subs) {
          if (!partials.stackText[key]) {
            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
          }
        }
        template = createSpecializedPartial(template, partial.subs, partial.partials,
          this.stackSubs, this.stackPartials, partials.stackText);
      }
      this.partials[symbol].instance = template;

      return template;
    },

    // tries to find a partial in the current scope and render it
    rp: function(symbol, context, partials, indent) {
      var partial = this.ep(symbol, partials);
      if (!partial) {
        return '';
      }

      return partial.ri(context, partials, indent);
    },

    // render a section
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];

      if (!isArray(tail)) {
        section(context, partials, this);
        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    // maybe start a section
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      if (typeof val == 'function') {
        val = this.ms(val, ctx, partials, inverted, start, end, tags);
      }

      pass = !!val;

      if (!inverted && pass && ctx) {
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
      }

      return pass;
    },

    // find values with dotted names
    d: function(key, ctx, partials, returnFound) {
      var found,
          names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          doModelGet = this.options.modelGet,
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        val = ctx[ctx.length - 1];
      } else {
        for (var i = 1; i < names.length; i++) {
          found = findInScope(names[i], val, doModelGet);
          if (found != null) {
            cx = val;
            val = found;
          } else {
            val = '';
          }
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.mv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    // find values with normal names
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false,
          doModelGet = this.options.modelGet;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        val = findInScope(key, v, doModelGet);
        if (val != null) {
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.mv(val, ctx, partials);
      }

      return val;
    },

    // higher order templates
    ls: function(func, cx, partials, text, tags) {
      var oldTags = this.options.delimiters;

      this.options.delimiters = tags;
      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
      this.options.delimiters = oldTags;

      return false;
    },

    // compile text
    ct: function(text, cx, partials) {
      if (this.options.disableLambda) {
        throw new Error('Lambda features disabled.');
      }
      return this.c.compile(text, this.options).render(cx, partials);
    },

    // template result buffering
    b: function(s) { this.buf += s; },

    fl: function() { var r = this.buf; this.buf = ''; return r; },

    // method replace section
    ms: function(func, ctx, partials, inverted, start, end, tags) {
      var textSource,
          cx = ctx[ctx.length - 1],
          result = func.call(cx);

      if (typeof result == 'function') {
        if (inverted) {
          return true;
        } else {
          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;
          return this.ls(result, cx, partials, textSource.substring(start, end), tags);
        }
      }

      return result;
    },

    // method replace variable
    mv: function(func, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = func.call(cx);

      if (typeof result == 'function') {
        return this.ct(coerceToString(result.call(cx)), cx, partials);
      }

      return result;
    },

    sub: function(name, context, partials, indent) {
      var f = this.subs[name];
      if (f) {
        this.activeSub = name;
        f(context, partials, this, indent);
        this.activeSub = false;
      }
    }

  };

  //Find a key in an object
  function findInScope(key, scope, doModelGet) {
    var val, checkVal;

    if (scope && typeof scope == 'object') {

      if (scope[key] != null) {
        val = scope[key];

      // try lookup with get for backbone or similar model data
      } else if (doModelGet && scope.get && typeof scope.get == 'function') {
        val = scope.get(key);
      }
    }

    return val;
  }

  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
    function PartialTemplate() {};
    PartialTemplate.prototype = instance;
    function Substitutions() {};
    Substitutions.prototype = instance.subs;
    var key;
    var partial = new PartialTemplate();
    partial.subs = new Substitutions();
    partial.subsText = {};  //hehe. substext.
    partial.buf = '';

    stackSubs = stackSubs || {};
    partial.stackSubs = stackSubs;
    partial.subsText = stackText;
    for (key in subs) {
      if (!stackSubs[key]) stackSubs[key] = subs[key];
    }
    for (key in stackSubs) {
      partial.subs[key] = stackSubs[key];
    }

    stackPartials = stackPartials || {};
    partial.stackPartials = stackPartials;
    for (key in partials) {
      if (!stackPartials[key]) stackPartials[key] = partials[key];
    }
    for (key in stackPartials) {
      partial.partials[key] = stackPartials[key];
    }

    return partial;
  }

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos = /\'/g,
      rQuot = /\"/g,
      hChars = /[&<>\"\']/;

  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp, '&amp;')
        .replace(rLt, '&lt;')
        .replace(rGt, '&gt;')
        .replace(rApos, '&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})(typeof exports !== 'undefined' ? exports : Hogan);

},{}],16:[function(require,module,exports){
module.exports = function(Class, validator) {
  if(typeof Class !== 'function') {
    throw new Error('simple-factory takes a function as it\'s first parameter.');
  }

  if(validator && typeof validator !== 'function') {
    throw new Error('simple-factory takes a function as it\'s second parameter');
  }

  return function() {
    var args = Array.prototype.splice.call(arguments, 0);

    //pre-bind the arguments of the class to be what was passed
    //becuase you can't call .apply with the new keyword
    //NOTE: the first arg needs to be the scope - this
    var fn = Class.bind.apply(Class, [this].concat(args));

    if(typeof validator === 'function') {
      return validator.apply(this, args) ? new fn() : null;
    } else {
      return new fn();
    }
  };
};
},{}]},{},[1])