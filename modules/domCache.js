//Private stuff..

var scoreMeterContainer = document.getElementById('Score'),
		errorsContainer = document.getElementById('Errors');


module.exports = {

  levelsContainer: document.getElementById('Levels'),

  buttons: {
    save: document.getElementById('Save'),
    retrieve: document.getElementById('Retrieve'),
    addLevel: document.getElementById('Add-Level'),
    calculate: document.getElementById("Calculate")
  },
  
  errors: {
    weights: errorsContainer.querySelector('.weights')
  }

};