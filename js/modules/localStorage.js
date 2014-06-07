var domParser  = require('./domParser'),
    calculator = require('./calculator'),
    KEY = 'RESULTS_DATA',
    cache, api,
    DOM_ELMS = {
      saveBtn: document.getElementById('Save'),
      retrieveBtn: document.getElementById('Retrieve')
    },

    get = function() {
      if(cache) { return cache; }

      try {
        var data = api.getItem(KEY);
        return data ? (cache = JSON.parse(data)) : null;
      } catch (e) {
        console.log("ERROR localStorage.retrieve() "+ e);
        return null;
      }

    },
    set = function(data) {
      cache = data;
      api.setItem(KEY, JSON.stringify(data));
    },
    addEventHandlers = function() {
      //Event Handlers
      DOM_ELMS.saveBtn.addEventListener('click', function() {
        set(domParser.parseLevels());
        //change the button to 'Saved!' with a different colour
        var btn = DOM_ELMS.saveBtn,
            previousHtml = btn.innerHTML;

        btn.innerHTML = 'Saved!';
        btn.classList.add('icon-ok');

        setTimeout(function() {
          btn.innerHTML = previousHtml;
          btn.classList.remove('icon-ok');
        }, 700);

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

    try {
      api = Android;
    } catch(e) {
      api = window.localStorage || null;
    }

    if(api) {
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
