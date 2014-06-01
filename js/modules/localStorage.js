var domParser  = require('./domParser'),
    calculator = require('./calculator'),
    KEY = 'RESULTS_DATA',
    cache = null,
    DOM_ELMS = {
      saveBtn: document.getElementById('Save'),
      retrieveBtn: document.getElementById('Retrieve')
    },

    get = function() {
      if(cache) { return cache; }
      return (cache = JSON.parse(window.localStorage.getItem(KEY))); //we can get away with this.
    },
    set = function(data) {
      cache = data;
      window.localStorage.setItem(KEY, JSON.stringify(data));
    },
    addEventHandlers = function() {
      //Event Handlers
      DOM_ELMS.saveBtn.addEventListener('click', function() {
        set(domParser.parseLevels());
        //change the button to 'Saved!' with a different colour
        var btn = DOM_ELMS.saveBtn;

        btn.innerHTML = 'Saved!';
        btn.classList.add('btn-green');

        setTimeout(function() {
          btn.innerHTML = 'Save Results';
          btn.classList.remove('btn-green');
        }, 500);

      });

      DOM_ELMS.retrieveBtn.addEventListener('click', function() {
        var results = get();
        domParser.restorePrev(results);
        //recall calculate
        calculator.calculate(results);
        //update the button back to 'save'
        DOM_ELMS.retrieveBtn.style.display = "none";
        DOM_ELMS.saveBtn.style.display = "block";
      });

    };

//Expose the API
module.exports = {

  init: function() {
    if(window.localStorage) {
      addEventHandlers();
      if(get()) {
        DOM_ELMS.retrieveBtn.style.display = "block";
      } else {
        DOM_ELMS.saveBtn.style.display = "block";
      }
    }
  },
  store: set,
  retrieve: get
};
