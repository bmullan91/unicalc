(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {

  greaterThan100: {
    expectedResult: 0,
    years: [
      {
        worth: 50,
        modules: [
          {
            percentage: 75
          }
        ]
      },
      {
        worth: 51,
        modules: [
          {
            percentage: 67
          }
        ]
      }
    ]
  },

  simple: {
    expectedResult: 75,
    years: [{
      worth: 100,
      modules: [
        {
          weight: 1,
          percentage: 75
        }
      ]
    }]
  },

  zeroModules: {
    expectedResult: 0,
    years: [{
      worth: 100,
      modules: [{
        weight: 100,
        percentage: 0
      }]
    }]
  },

  complex: {
    expectedResult: 70,
    years: [
      {
        worth: 30,
        modules: [
          {
            weight: 1, 
            percentage: 53
          },
          {
            weight: 2,
            percentage: 67
          },
          {
            weight: 3,
            percentage: 80
          }
        ]
      },
      {
        worth: 70,
        modules: [
          {
            weight: 1,
            percentage: 78
          },
          {
            weight: 2,
            percentage: 63
          },
          {
            weight: 3,
            percentage: 71
          }
        ]
      }
    ]
  },

  lotsOfModules: {
    expectedResult: 50,
    years:[{
      worth: 100,
      modules: [
        {
          percentage: 0,
        },
        {
          percentage: 10
        },
        {
          percentage: 20
        },
        {
          percentage: 30,
        },
        {
          percentage: 40
        },
        {
          percentage: 50
        },
        {
          percentage: 60
        },
        {
          percentage: 70
        },
        {
          percentage: 80
        },
        {
          percentage: 90
        },
        {
          percentage: 100
        }
      ]
    }]
  }
};
},{}],2:[function(require,module,exports){
;(function() {

  //Globals..
  var testData = require('./data');
  var iframe = document.getElementById('Iframe');
  var markerOffset = 2;
  var DOM_ELEMS, doc, win;

  mocha.ui('bdd');
  mocha.reporter('html');
  expect = chai.expect;

  //set up listener
  iframe.onload = function init() {
    //reset the onload - preventing an infinite loop when calling reloadPage()
    iframe.onload = null;
    attachDOM();
    if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
    else { mocha.run(); }
  }

  ///////////////////////////////////
  //        Actual Tests           //
  ///////////////////////////////////

  describe('Checks & Error handling', function () {

    it("Should show an error when calculate is clicked before any input data", function (done) {
      DOM_ELEMS.btn.calculate.click();
      expectError();
      //clear error
      reloadPage(done);

    });

    it("Should show an error when invalid year weights are input", function (done) {

      inputTestData(testData.greaterThan100.years);
      DOM_ELEMS.btn.calculate.click();
      expectError();
      //clear error
      reloadPage(done);        

    });

  });

  describe("Buttons should work as expected..", function () {

    it("Clicking the add year btn should do its thing", function (done) {
      var initialCount = doc.querySelectorAll('.level').length;
      DOM_ELEMS.btn.addYear.click(); 
      expect(doc.querySelectorAll('.level').length).to.equal(initialCount+1);
      done();
    });

    it("Clicking the add module btn should do its thing", function (done) {
      //check it works for the first year..
      var firstYear = doc.querySelector('.level');
      var firstBtn = firstYear.querySelector('button');
      var firstYearCount = firstYear.querySelectorAll('.module').length;

      firstBtn.click();
      expect(firstYear.querySelectorAll('.module').length).to.equal(firstYearCount+1);

      //add another year
      //click its add module button should not affect another year..
      DOM_ELEMS.btn.addYear.click();
      var secondYear = doc.querySelectorAll('.level')[1];
      var secondBtn = secondYear.querySelector('button'); 
      var secondYearCount = secondYear.querySelectorAll('.module').length;

      secondBtn.click();
      //this stays the same..
      expect(firstYear.querySelectorAll('.module').length).to.equal(firstYearCount+1);
      //only the second year will add a module..
      
      expect(secondYear.querySelectorAll('.module').length).to.equal(secondYearCount+1);
      done();

    });

    it("Clicking the Save button should do its thing", function (done) {
      var btn = DOM_ELEMS.btn.save;
      btn.click();
      //test the button state changes, and reverts..
      expect(btn.classList.contains('btn-green')).to.equal(true);

      setTimeout(function () {
        expect(btn.classList.contains('btn-blue')).to.equal(true);
        done();
      }, 501);
    });

    it("Clicking the Retrieve button should do it's thing", function (done) {
      //this test requires set up..
      inputTestData(testData.complex.years);
      DOM_ELEMS.btn.save.click();
      reloadPage(function () {
        //real tests can begin...
        var retrievebtn = DOM_ELEMS.btn.retreieve;
        var savebtn = DOM_ELEMS.btn.save;
        expect(retrievebtn.style.display).to.equal("block");
        expect(savebtn.style.display).to.equal("");

        //clicking retreieve the button should intern call calculate
        retrievebtn.click();
        expectScoreToBe(testData.complex.expectedResult);
        //button should revert to 'save'
        expect(retrievebtn.style.display).to.equal("none");
        expect(savebtn.style.display).to.equal("block");

        //reload the page for next tests..
        reloadPage(done);
      });
      
    });

    it("Testing retreieve button bug..", function (done) {
      //when there a saved results and new ones are input, the 'retreive'
      //button should revert to 'save'

      //there should be saved results from the previous test..
      inputTestData(testData.greaterThan100.years);
      DOM_ELEMS.btn.calculate.click();
      expect(DOM_ELEMS.btn.retreieve.style.display).to.equal("none");
      expect(DOM_ELEMS.btn.save.style.display).to.equal("block");

      reloadPage(done);

    });

    it("Clicking the calculate button will give the correct result and animate the marker position", function (done) {
      inputTestData(testData.complex.years);
      DOM_ELEMS.btn.calculate.click();
      expectScoreToBe(testData.complex.expectedResult, reloadPage.bind(this, done));
    });


  });

  describe("Test core calculation logic some more..", function () {

    it("Should calculate an average of 75%", function (done) {
      inputTestData(testData.simple.years);
      DOM_ELEMS.btn.calculate.click();
      expectScoreToBe(testData.simple.expectedResult, reloadPage.bind(this, done));
    });

    it("Should calculate an average of 0%", function (done) {
      inputTestData(testData.zeroModules.years);
      DOM_ELEMS.btn.calculate.click();
      expectScoreToBe(testData.zeroModules.expectedResult, reloadPage.bind(this, done));
    });

    it("Should calculate an average of 50%", function (done) {
      inputTestData(testData.lotsOfModules.years);
      DOM_ELEMS.btn.calculate.click();
      expectScoreToBe(testData.lotsOfModules.expectedResult, reloadPage.bind(this, done));
    });

    it("Should calculate an average of 70%", function (done) {
      inputTestData(testData.complex.years);
      DOM_ELEMS.btn.calculate.click();
      expectScoreToBe(testData.complex.expectedResult, reloadPage.bind(this, done));
    });

  });

  ///////////////////////////////////
  //         Assertions            //
  ///////////////////////////////////

  function expectError() {
    expect(doc.querySelector('#Errors .weights').style.display).to.equal('block');
  }

  function expectAnimation(percentage, cb) {
    if(percentage <=0) return cb();
    var marker = DOM_ELEMS.marker;

    function getMarkerPosition() {
      var translateX = marker.style.webkitTransform;
      return translateX ? translateX.split('(')[1].split('px')[0] : 0;// "translateX(790.501px)" --> 790 
    }

    marker.addEventListener('webkitTransitionEnd', function() {
      var expectedPos = Math.floor((DOM_ELEMS.score.scrollWidth / 100) * percentage); 
      var acutalPos = Math.floor(getMarkerPosition());

      expect(expectedPos-markerOffset).to.equal(acutalPos);
      return cb ? cb() : undefined; 
    });
  }

  function expectScoreToBe(percentage, cb) {
    expect(DOM_ELEMS.value.innerHTML).to.equal(percentage+"%");

    if(cb) {
      //test animation
      expectAnimation(percentage, cb);
    }

  }

  ///////////////////////////////////
  //         Helpers               //
  ///////////////////////////////////

  function attachDOM() {
    //after reloadPage, the dom etc is new..
    doc = iframe.contentDocument;
    win = iframe.contentWindow;

    DOM_ELEMS = {
      btn: {
        save: doc.getElementById('Save'),
        retreieve: doc.getElementById('Retrieve'),
        calculate: doc.getElementById('Calculate'),
        addYear: doc.getElementById('Add-Level')
      },
      score: doc.getElementById('Score'),
      marker: doc.querySelector('#Score .marker'),
      value: doc.querySelector('#Score .marker .value')
    };

  }

  function reloadPage(done) {
    iframe.onload = function() {
      attachDOM();
      done(); 
    }
    win.location.reload();
  }

  function getLevelElems() {
    return doc.querySelectorAll('.level');
  }

  function getModuleElems(levelElem) {
    return levelElem.querySelectorAll('.module');
  }

  //See test data structure
  function inputTestData(years) {

    for(var i = 0, l = years.length; i < l; i++) {
      var levelElem = getLevelElems()[i];
      var year = years[i];

      //check is there a level's div..
      if(!levelElem) { 
        DOM_ELEMS.btn.addYear.click(); 
        levelElem = getLevelElems()[i];
      }

      levelElem.querySelector('.level-weight input').value = year.worth;

      //now add each module data
      for(j = 0, k = year.modules.length; j < k; j++) {
        var module = year.modules[j];
        var moduleElem = getModuleElems(levelElem)[j];

        if(!moduleElem) {
          levelElem.querySelector('button').click();
          moduleElem = getModuleElems(levelElem)[j];
        }

        moduleElem.querySelector('.percentage input').value = module.percentage;
        moduleElem.querySelector('.ratio input').value = module.weight || 1;
      }

    }
  }

})();

},{"./data":1}]},{},[2])