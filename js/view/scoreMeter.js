var container = document.getElementById('Score');
var meterContainer = container.querySelector('.meter-container');
var marker = container.querySelector('.marker');
var value = container.querySelector('.value');
var markerWidth = 3; // 3px, not worth doing a window.getComputedStyle
var cssProps = ['-webkit-transform', '-moz-transform', '-ms-transform', '-o-transform', 'transform'];

function applyTransform(value) {
  cssProps.forEach(function(prop) {
    marker.style[prop] = 'translateX(' + value + 'px)';
  });
}

function onMobile() {
  var margins = ((document.body.scrollWidth - meterContainer.scrollWidth) / 2);
  return (margins < value.scrollWidth);
}

/*
  Algebra time.

  <-------------- a ------------------>
  [==========score-meter==============]

    markerPos
  [====|=====score-meter==============]


  
  [====|=====score-meter==============]
    [value]
    <--b-->
  
  
  Edge case @ 98%> roughly

  y = width overlapping the score-meter
  z = width overhanging

                                    <y><z> 
  [==========score-meter=============|]
                                   [value]

  
  y = a - markerPos
  z = b - y

  offset = -(z)
*/
function setMarkerValuePos(markerPos) {
  var a = meterContainer.scrollWidth;
  var b = value.scrollWidth;

  var y = a - markerPos;
  var z = b - y;

  var offset = -(b / 2); //default

  if(onMobile()) {
    if(markerPos < (b / 2)) {
      offset = 0;
    } else if(z > 0) {
      //overlap
      offset = -(z);
    } else {
      //default middle ground, already set.
    }
  }

  value.style.marginLeft = offset + 'px';
}

module.exports.update = function(score) {
  score = Math.round(score * 100) / 100;
  var leftPos = ((meterContainer.scrollWidth / 100) * score);

  applyTransform(leftPos - (markerWidth / 2));
  value.innerHTML = score+'%';
  setMarkerValuePos(leftPos);
};
