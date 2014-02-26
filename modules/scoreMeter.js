var container = document.getElementById('Score'),
		marker    = container.querySelector('.marker'),
    value     = container.querySelector('.value'),
    width     = container.scrollWidth;

module.exports.update = function(score) {
	score = Math.round(score * 100) / 100;
  var leftPos = ((width / 100) * score);

  marker.style.left =  leftPos-1.5 +'px';
  value.innerHTML = score+'%';
};