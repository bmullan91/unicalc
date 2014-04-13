(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function() {

  var testData = require('./testData');

  mocha.ui('bdd');
  mocha.reporter('html');
  expect = chai.expect;

  //set up listener
  var iframe = document.getElementById('Iframe');
  var doc = null;
  var win = null;

  iframe.onload = function init() {

    //reset the onload - preventing an infinite loop when calling reloadPage()
    iframe.onload = null;

    doc = iframe.contentDocument;
    win = iframe.contentWindow;

    tests();

    if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
    else { mocha.run(); }


  }


  function reloadPage(done) {
    iframe.onload = function() {
      //update the doc and win vars as the page has been refreshed 
      doc = iframe.contentDocument;
      win = iframe.contentWindow;
      done(); 
    }
    win.location.reload();
  }

  function clickCalculate() {
    //test it works..
    doc.getElementById('Calculate').click();
  }

  function clickAddYear() {
    //test it works
    doc.getElementById('Add-Level').click();
  }

  function clickAddModule(levelElm) {
    //test it works
    levelElm.querySelector('button').click();
  }

  function expectError() {
    expect(doc.querySelector('#Errors .weights').style.display).to.equal('block');
  }

  function expectScoreToBe(percentage, cb) {
    var scoreMeter = doc.getElementById('Score');
    var marker = scoreMeter.querySelector('.marker');
    var value = marker.querySelector('.value');
    var offset = 2;

    expect(value.innerHTML).to.equal(percentage+"%");

    if(percentage === 0) {
      afterAnimation();
    } else {
      marker.addEventListener('webkitTransitionEnd', afterAnimation);
    }

    function afterAnimation (e) {
      var expectedPos = (scoreMeter.scrollWidth / 100) * percentage;
      var translateX = marker.style.webkitTransform;
      var acutalPos = Math.floor(translateX.split('(')[1].split('px')[0]); // "translateX(790.501px)" --> 790 

      expect(expectedPos-offset).to.equal(acutalPos);
      cb();
    }

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
        clickAddYear(); 
        levelElem = getLevelElems()[i];
      }

      levelElem.querySelector('.level-weight input').value = year.worth;

      //now add each module data
      for(j = 0, k = year.modules.length; j < k; j++) {
        var module = year.modules[j];
        var moduleElem = getModuleElems(levelElem)[j];

        if(!moduleElem) {
          clickAddModule(levelElem);
          moduleElem = getModuleElems(levelElem)[j];
        }

        moduleElem.querySelector('.percentage input').value = module.percentage;
        moduleElem.querySelector('.ratio input').value = module.weight || 1;
      }


    }
  }



  //Tests

  function tests() {

    describe('Checks & Error handling', function () {

      it("Should show an error when calculate is clicked before any input data", function (done) {
        clickCalculate();
        expectError();
        //clear error
        reloadPage(done);

      });

      it("Should show an error when invalid year weights are input", function (done) {

        var yearOne = doc.querySelector(".level");
        yearOne.querySelector('.level-weight input').value = 101;
        clickCalculate();
        expectError();
        //clear error
        reloadPage(done);

      });

      it("Should show the same error when mutliple year's weights are greater than 100%", function (done) {

        clickAddYear(); // todo test clicking add button
        var years = doc.querySelectorAll(".level");
        var yearOne = years[0];
        var yearTwo = years[1];

        yearOne.querySelector('.level-weight input').value = 100;
        yearTwo.querySelector('.level-weight input').value = 1;

        clickCalculate();
        expectError();

        //clear error
        reloadPage(done);        

      });

    });

    describe("Test core calculation logic", function () {

      it("Should calculate an average of 75%", function (done) {

        inputTestData(testData.oneYear.years);

        clickCalculate();
        expectScoreToBe(testData.oneYear.expectedResult, function () {
          reloadPage(done); 
        });

      });

      it("Should calculate an average of 0%", function (done) {

        inputTestData(testData.zeroModules.years);

        clickCalculate();
        expectScoreToBe(testData.zeroModules.expectedResult, function () {
          reloadPage(done); 
        });

      });

    });

  }


})();

},{"./testData":2}],2:[function(require,module,exports){
module.exports = {

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
  },

  //TODO - rename
  oneYear: {
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
  }
};
},{}]},{},[1])