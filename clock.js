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
      'stroke'        : '#630', 
      'fill'          : 'r(0.25, 0.25)#fff-#668'
    });

    // Numbers
    for (var n = 1; n <= 12; n++){

      var font_size = 48;
      var x = my.center.x;
      var y = my.center.y - my.radius + my.frame.attr('stroke-width') + font_size / 3;
      var degrees = 360 / 12 * n;

      // Create the number (initially at the 12 o'clock position)
      my.paper.text( x, y, n.toString())

      // Move it around to its proper place.. (and keep it upright)
      .transform("r" + degrees + "," + my.center.x + "," + my.center.y + "r-" + degrees)

      // And twiddle its appearance
      .attr(
        { 
          'font-size' : font_size,
          //'font-family': "Marcellus SC"
          //'font-family': "Elsie Swash Caps"
          //'font-family': "Purple Purse"
          'font-family'  : "sans-serif"
        });
    }

    // Draw hands
    my.hands = {
      second: draw_hand(0, 1),
      minute: draw_hand(20, 1),
      hour:   draw_hand(30, 0.6)
    };

    // Center post
    my.center_post = my.paper.circle(
      my.center.x,
      my.center.y,
      my.radius * 0.09
    ).attr({
      'fill'          : '#aa4',
      'stroke'        : 'none'
    });


  };

  my.set_time = function(time){
  };

  my.start = function(){
  };

  my.stop = function(){
  };

  // Private

  draw_hand = function(base_width, length) {
    // base_width: how wide (in pixels) the hand is at the center of the clock
    // length: hand length as a ratio of the clock radius (in the range 0..1)

    var half_width = base_width / 2;
    return my.paper.path(
      "M" + (my.center.x - half_width) + "," + my.center.y +
      "l" + half_width + "," + (-1 * length * (my.radius - my.frame.attr('stroke-width'))) +
      "l" + half_width + "," + length * (my.radius - my.frame.attr('stroke-width')) +
      "z"
    ).attr({
      fill: "#000"
    });
  };

};
