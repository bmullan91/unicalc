var container = document.getElementById('Score');
var marker = container.querySelector('.marker');
var value = container.querySelector('.value');
var cssProps = ['-webkit-transform', '-moz-transform', '-ms-transform', '-o-transform', 'transform'];

function applyTransform(value) {
  cssProps.forEach(function(prop) {
    marker.style[prop] = 'translateX(' + value + 'px)';
  });
}

module.exports.update = function(score) {
	score = Math.round(score * 100) / 100;
  var leftPos = ((container.scrollWidth / 100) * score);

  applyTransform(leftPos-1.5);
  value.innerHTML = score+'%';
};