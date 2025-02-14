function RandomObjectMover(obj, container) {
	this.$object = obj;
  this.$container = container;
  this.container_is_window = container === window;
  this.pixels_per_second = 50;
  this.current_position = { x: 0, y: 0 };
  this.is_running = false;
}

RandomObjectMover.prototype.setSpeed = function(pxPerSec) {
	this.pixels_per_second = pxPerSec;
}

RandomObjectMover.prototype._getContainerDimensions = function() {
   if (this.$container === window) {
       return { 'height' : this.$container.innerHeight, 'width' : this.$container.innerWidth };
   } else {
   	   return { 'height' : this.$container.clientHeight, 'width' : this.$container.clientWidth };
   }
}

RandomObjectMover.prototype._generateNewPosition = function() {

  var containerSize = this._getContainerDimensions();
	var availableHeight = containerSize.height - this.$object.clientHeight;
  var availableWidth = containerSize.width - this.$object.clientHeight;
  var y = Math.floor(Math.random() * availableHeight);
  var x = Math.floor(Math.random() * availableWidth);
    
  return { x: x, y: y };    
}

RandomObjectMover.prototype._calcDelta = function(a, b) {
	var dx   = a.x - b.x;         
  var dy   = a.y - b.y;         
  var dist = Math.sqrt( dx*dx + dy*dy ); 
  return dist;
}

RandomObjectMover.prototype._moveOnce = function() {
    var next = this._generateNewPosition();
    var delta = this._calcDelta(this.current_position, next);
		var speed = Math.round((delta / this.pixels_per_second) * 100) / 100;
    this.$object.style.transition='transform '+speed+'s linear';
    this.$object.style.transform='translate3d('+next.x+'px, '+next.y+'px, 0)';
    this.current_position = next;
};
RandomObjectMover.prototype.start = function() {

	if (this.is_running) {
  	return;
  }
  this.$object.willChange = 'transform';
  this.$object.pointerEvents = 'auto';
  this.boundEvent = this._moveOnce.bind(this)
  this.$object.addEventListener('transitionend', this.boundEvent);
  this._moveOnce();
  this.is_running = true;
}

RandomObjectMover.prototype.stop = function() {

	if (!this.is_running) {
  	return;
  }
  this.$object.removeEventListener('transitionend', this.boundEvent);
  
	this.is_running = false;
}

var x = new RandomObjectMover(document.getElementById('a'), window);

document.getElementById('start').addEventListener('click', function(){
	x.start();
});
document.getElementById('stop').addEventListener('click', function(){
	x.stop();
});
document.getElementById('speed').addEventListener('keyup', function(){
  if (parseInt(this.value) > 3000 ) {
 		alert('Don\'t be stupid, stupid');
    this.value = 250;
  }
	x.setSpeed(parseInt(this.value));
});

x.start();