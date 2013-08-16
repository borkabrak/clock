$(function(){
  clock = new Clock();
  clock.draw();
});

var width = 500;
var height = 500;

Clock = function(){

  var my = this;

  my.paper = new Raphael(document.getElementById("clock"), width, height);

  my.center = {
    x: (my.paper.width / 2),
    y: (my.paper.height / 2)
  };

  my.radius = (my.paper.width >= my.paper.height ? my.paper.height : my.paper.width) / 2 - 20;

  my.draw = function(){

    // Frame
    my.frame = my.paper.circle(my.center.x, my.center.y, my.radius)
    .attr({
      'stroke-width'  : 30,
      'stroke'        : '#963', 
      'fill'          : '#dde'
    });

    // Numbers
    for (var n = 1; n <= 12; n++){
      // Create the number at the 12 o'clock position..
      var x = my.center.x;
      var y = my.center.y - my.radius + my.frame.attr('stroke-width');
      my.paper.text( x, y, n.toString()
    )
      // ..move it around to its proper place..
      .transform("r" + (360 / 12 * n) + "," + my.center.x + "," + my.center.y)

      // ..and twiddle its appearance
      .attr({ 'font-size' : 24 });
    };

    // Hands
  };

  my.set_time = function(time){
  };

  my.start = function(){
  };

  my.stop = function(){
  };

};
