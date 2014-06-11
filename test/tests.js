;(function() {

  ///////////////////////////////////
  // phantomjs polyfills
  ///////////////////////////////////
  //click function is not on element in phantomjs
  function clickElement(el) {
    var ev = doc.createEvent("MouseEvent");
    ev.initMouseEvent(
      "click",
      true /* bubble */, true /* cancelable */,
      window, null,
      0, 0, 0, 0, /* coordinates */
      false, false, false, false, /* modifier keys */
      0 /*left*/, null
    );
    el.dispatchEvent(ev);
  }

  ////////////////////////////////////

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
      var initialCount = doc.querySelectorAll('.year').length;
      DOM_ELEMS.btn.addYear.click(); 
      expect(doc.querySelectorAll('.year').length).to.equal(initialCount+1);
      done();
    });

    it("Clicking the add module btn should do its thing", function (done) {
      //check it works for the first year..
      var firstYear = doc.querySelector('.year');
      var firstBtn = firstYear.querySelector('button');
      var firstYearCount = firstYear.querySelectorAll('.module').length;

      firstBtn.click();
      expect(firstYear.querySelectorAll('.module').length).to.equal(firstYearCount+1);

      //add another year
      //click its add module button should not affect another year..
      DOM_ELEMS.btn.addYear.click();
      var secondYear = doc.querySelectorAll('.year')[1];
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
      expect(localStorage.getItem("RESULTS_DATA")).to.be.a("string");
      done();
    });

    it("Clicking the open button should do it's thing", function (done) {
      //this test requires set up..
      inputTestData(testData.complex.years);
      DOM_ELEMS.btn.save.click();
      reloadPage(function () {
        //real tests can begin...
        var openbtn = DOM_ELEMS.btn.open;
        var savebtn = DOM_ELEMS.btn.save;
        expect(openbtn.style.display).to.equal("block");
        expect(savebtn.style.display).to.equal("none");

        //clicking open the button should intern call calculate
        openbtn.click();
        expectScoreToBe(testData.complex.expectedResult);
        //button should revert to 'save'
        expect(openbtn.style.display).to.equal("none");
        expect(savebtn.style.display).to.equal("block");

        //reload the page for next tests..
        reloadPage(done);
      });
      
    });

    it("Testing open button bug..", function (done) {
      //when there a saved results and new ones are input, the 'open'
      //button should revert to 'save'

      //there should be saved results from the previous test..
      inputTestData(testData.greaterThan100.years);
      DOM_ELEMS.btn.calculate.click();
      expect(DOM_ELEMS.btn.open.style.display).to.equal("none");
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
    expect(doc.getElementById('Errors').children.length > 0).to.be.true;
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
        open: doc.getElementById('Open'),
        calculate: doc.getElementById('Calculate'),
        addYear: doc.getElementById('Add-Year')
      },
      score: doc.getElementById('Score'),
      marker: doc.querySelector('#Score .marker'),
      value: doc.querySelector('#Score .marker .value')
    };

    DOM_ELEMS.btn.addYear.click = function() {
      clickElement(DOM_ELEMS.btn.addYear);
    }

  }

  function reloadPage(done) {
    iframe.onload = function() {
      attachDOM();
      done(); 
    }
    win.location.reload();
  }

  function getYearElems() {
    return doc.querySelectorAll('.year');
  }

  function getModuleElems(yearElem) {
    return yearElem.querySelectorAll('.module');
  }

  //See test data structure
  function inputTestData(years) {

    for(var i = 0, l = years.length; i < l; i++) {
      var yearElem = getYearElems()[i];
      var year = years[i];

      //check is there a year's div..
      if(!yearElem) { 
        DOM_ELEMS.btn.addYear.click(); 
        yearElem = getYearElems()[i];
      }

      yearElem.querySelector('.year-weight input').value = year.worth;

      //now add each module data
      for(j = 0, k = year.modules.length; j < k; j++) {
        var module = year.modules[j];
        var moduleElem = getModuleElems(yearElem)[j];

        if(!moduleElem) {
          yearElem.querySelector('button').click();
          moduleElem = getModuleElems(yearElem)[j];
        }

        moduleElem.querySelector('.percentage input').value = module.percentage;
        moduleElem.querySelector('.ratio input').value = module.weight || 1;
      }

    }
  }

})();
