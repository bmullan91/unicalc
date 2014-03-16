var container = document.getElementById('Score'),
		marker    = container.querySelector('.marker'),
    value     = container.querySelector('.value'),
    width     = container.scrollWidth;

function applyTransform(value) {
  var props = ['-webkit-transform', '-moz-transform', '-ms-transform', '-o-transform', 'transform'];

  props.forEach(function(prop) {
    marker.style[prop] = 'translateX(' + value + 'px)';
  });
}

module.exports.update = function(score) {
	score = Math.round(score * 100) / 100;
  var leftPos = ((width / 100) * score);

  applyTransform(leftPos-1.5);
  value.innerHTML = score+'%';
};