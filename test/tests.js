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



  //Tests

  function tests() {

    describe('Checks & Error handling', function () {

      it("Should show an error when calculate is clicked before any input data", function (done) {
        doc.getElementById('Calculate').click();
        expect(doc.querySelector('#Errors .weights').style.display).to.equal('block');

        //clear error
        reloadPage(done);

      });

      it("Should show an error when invalid year weights are input", function() {

        var yearOne = doc.querySelector(".level");
        yearOne.querySelector('.level-weight input').value = 101;
        doc.getElementById('Calculate').click();
        expect(doc.querySelector('#Errors .weights').style.display).to.equal('block');


      });

    });

  }


})();
