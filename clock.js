$(function(){

  clock = new Clock();
  clock.draw();
  clock.start();

});

Clock = function(){

  var my = this;
  
  // Size of the square canvas is the smaller of the document's width and
  // height (so it fits)
  var size = (document.width >= document.height ? document.height : document.width) * 0.8;
  my.paper = new Raphael(document.getElementById("clock"), size, size);

  my.center = {
    x: (my.paper.width / 2),
    y: (my.paper.height / 2)
  };

  my.radius = (my.paper.width >= my.paper.height ? my.paper.height : my.paper.width) / 2 - 20;

  my.draw = function(){

    // Light source direction (for radial gradients)
    var light_source = {
      x: 0.25,
      y: 0.25
    };

    // Frame
    my.frame = my.paper.circle(my.center.x, my.center.y, my.radius)
    .attr({
      'stroke-width'  : 30,
      'stroke'        : '#630', 
      'fill'          : 'r(' + light_source.x + ',' + light_source.y + ')#fff-#668'
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
      'fill'          : 'r(' + light_source.x + ',' + light_source.y + ')#fff-#aa4',
      'stroke'        : 'none'
    });


  };

  my.set_time = function(time, duration){
    // Set the clock to a particular time
    //
    //  time: defaults to the current time
    //  duration: milliseconds for animation.  Default 0.
    time = moment(time);
    duration = duration || 0;
    rotate_to(my.hands.hour, (time.hour() % 12) * 5, duration);
    rotate_to(my.hands.minute, time.minute(), duration);
    rotate_to(my.hands.second, time.second(), duration);
  };

  my.start = function(){
    my.interval_id = setInterval(function(animation_speed){
      clock.set_time(moment(), animation_speed);
    }, 
    500,  // Update every half-second    
    100   // animation speed (param to the function)
    );
  };

  my.stop = function(){
    if ( typeof my.interval_id !== "undefined" ){
      clearInterval(my.interval_id);
    }
  };

  // Private

  rotate_to = function(hand, clock_position, duration) {
    // rotate hand to a point on the clock
    //
    //  hand - raphael path representing the hand
    //  clock_position - integer in 1..60
    //  duration - Optional milliseconds for animation.  Defaults to 0.

    hand.animate( 
      {
        transform: "R" + (clock_position * 6) + "," + my.center.x + "," + my.center.y 
      }, 
      duration || 0
    );

  };

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
