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
