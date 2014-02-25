var container = document.getElementById('Score'),
		marker = container.querySelector('.marker'),
    value = container.querySelector('.value');

module.exports.update = function(score) {
	score = Math.round(score * 100) / 100;
  var leftPos = ((container.scrollWidth / 100) * score);

  marker.style.left =  leftPos-1.5 +'px';
  value.innerHTML = score+'%';
};