var htmlStrings = {
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

  year: (function() {
    var htmlStr = document.querySelector(".year").innerHTML;
    htmlStr = htmlStr.replace(htmlStrings.tooltip, htmlStrings.noTooltip);

    return function() {
      var YearNum = document.getElementById('Years').children.length +1,
          year = "Year " + YearNum,
          doc = document.createElement('div'),
          newHtml = htmlStr.replace("Year 1", year);

      doc.className = "year card";
      doc.innerHTML = newHtml;
      return doc;
    }; 
  }())
};