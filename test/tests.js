;(function() {

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


  function reloadPage(cb) {
    iframe.onload = function() {
      //update the doc and win vars as the page has been refreshed 
      doc = iframe.contentDocument;
      win = iframe.contentWindow;
      cb(); 
    }
    win.location.reload();
  }

  function clickCalculate() {
    doc.getElementById('Calculate').click();
  }

  function clickAddYear() {
    doc.getElementById('Add-Level').click();
  }

  function expectError() {
    expect(doc.querySelector('#Errors .weights').style.display).to.equal('block');
  }

  function expectScoreToBe(percentage, cb) {
    var scoreMeter = doc.getElementById('Score');
    var marker = scoreMeter.querySelector('.marker');
    var value = marker.querySelector('.value');

    marker.addEventListener('webkitTransitionEnd', function (e) {
      var expectedPos = (scoreMeter.scrollWidth / 100) * percentage;
      var translateX = marker.style.webkitTransform;
      var acutalPos = Math.floor(translateX.split('(')[1].split('px')[0]); // "translateX(790.501px)" --> 790 

      expect(acutalPos).to.equal(expectedPos-2); // -2 is the offset
      cb();
    });

    expect(value.innerHTML).to.equal(percentage+"%");
    //TODO add tests for the translation
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

      var testData = {
        oneYear: {
          expectedResult: 75,
          years: [{
            worth: 100,
            modules: [
              {
                worth: 1,
                percentage: 75
              }
            ]
          }]
        }
      };

      it("Should calculate an average of 75%", function (done) {

        var testYear = testData.oneYear.years[0];
        var yearElm = doc.querySelector('.level');
        var module = yearElm.querySelector('.module');

        yearElm.querySelector('.level-weight input').value = testYear.worth;
        module.querySelector('.percentage input').value = testYear.modules[0].percentage;

        clickCalculate();
        expectScoreToBe(testYear.modules[0].percentage, done);

      });



    });

  }


})();
