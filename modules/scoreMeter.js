var container = document.getElementById('Score'),
		marker = container.querySelector('.marker'),
    value =container.querySelector('.value');

module.exports.update = function(score) {

	score = Math.round(score * 100) / 100;
  var leftPos = ((DOM_ELMS.scoreMeter.container.scrollWidth / 100) * score);

  DOM_ELMS.scoreMeter.marker.style.left =  leftPos-1.5 +'px';
  DOM_ELMS.scoreMeter.value.innerHTML = score+'%';

};