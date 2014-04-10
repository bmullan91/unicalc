;(function() {

  mocha.ui('bdd');
  mocha.reporter('html');
  expect = chai.expect;

  //set up listener
  var iframe = document.getElementById('Iframe');
  var doc = null;

  iframe.onload = function init() {

    doc = iframe.contentDocument;

    if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
    else { mocha.run(); }

  }

  //Tests

  describe('Checks', function () {

    it("Should show and error when calculate is clicked before any input data", function () {

      doc.getElementById('Calculate').click();
      expect(doc.querySelector('#Errors .weights').style.display).to.equal('block');

    })

  });



})();
