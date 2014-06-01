var events = require('./events'),
    htmlStrings = {
      tooltip: '<span class="ratio tooltip" title="Half module: 0.5, Single module: 1, Double module: 2, etc">Weight<input></span>',
      noTooltip : '<span class="ratio">Weight<input></span>'
    };

module.exports = {
  module: (function() {
      var htmlStr = document.querySelector('.module').innerHTML;
      
      htmlStr = htmlStr.replace(htmlStrings.tooltip, htmlStrings.noTooltip);

      return function() {
        var doc = document.createElement('div');
        doc.innerHTML = htmlStr;
        doc.className = 'module';
        return doc;
      };

    }()),

  level: (function() {
    var i = 1,
        htmlStr = document.querySelector(".level").innerHTML;

    htmlStr = htmlStr.replace(htmlStrings.tooltip, htmlStrings.noTooltip);

    return function() {
      var level = "Year "+(++i),
          doc = document.createElement('div'),
          newHtml = htmlStr.replace("Year 1", level);

      doc.className = "level lvl";
      doc.innerHTML = newHtml;
      events.addBtnHandler(doc.children[2]);
      return doc;
    }; 
  }())
};