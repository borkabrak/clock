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
          'font-family': "Purple Purse"
        });
    }

    // Draw hands
    my.hands = {
      second: null,
      minute: null,
      hour:   null
    };

    my.hands.second = my.paper.path(
      "M" + my.center.x + "," + my.center.y + 
      "l0," + (-1 * (my.radius - my.frame.attr('stroke-width'))) + 
      "z");

    my.hands.minute = my.paper.path(
      "M" + (my.center.x - 10) + "," + my.center.y + 
      "l10," + (-1 * (my.radius - my.frame.attr('stroke-width')))  + 
      "l10," + (my.radius - my.frame.attr('stroke-width'))   +
      "z").attr({
        fill: "#000"
      });

    // Center post
    my.center_post = my.paper.circle(
      my.center.x,
      my.center.y,
      my.radius * 0.08
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

};
