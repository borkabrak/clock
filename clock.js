$(function(){

  clock = new Clock(document.getElementById("clock"), {
    hands: "diamond",
  }).start();

});

Clock = function( container, options) {
  // settable options and defaults:
  //
  //    * hands: 'simple'
  //    * font_size: 6

  var my = this;
  options = options || {};

  // Roman numerals
  var roman_numerals = [ null, "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII" ];

  // Make the canvas a square that fits in the window
  var size = (document.width >= document.height ? document.height : document.width) * 0.8;
  my.paper = my.paper || new Raphael(container , size, size);

  my.center = {
      x: (my.paper.width / 2),
      y: (my.paper.height / 2)
  };

  my.radius = (my.paper.width >= my.paper.height ? my.paper.height : my.paper.width) / 2 - 20;

  // Light source direction (for radial gradients)
  var light_source = {
    x: 0.25,
    y: 0.25
  };

  // Frame
  my.frame = my.paper.circle(my.center.x, my.center.y, my.radius)
  .attr({
    'stroke-width'  : my.radius * 0.1,
    'stroke'        : '#404840',
    'fill'          : 'r(' + light_source.x + ',' + light_source.y + ')#fff-#668'
  });

  // Numbers
  for (var n = 1; n <= 12; n++) {

    var font_size = my.radius / (options.font_size || 6);
    var x = my.center.x;
    var y = my.center.y - my.radius + my.frame.attr('stroke-width') + font_size * 0.7;
    var degrees = 360 / 12 * n;

    // Create the number (initially at the 12 o'clock position)
    my.paper.text( x, y, roman_numerals[n] )

    // Move it around to its proper place.. (and keep it upright)
    .transform("r" + degrees + "," + my.center.x + "," + my.center.y + "r-" + degrees)

    // And twiddle its appearance
    .attr(
      { 
        'font-size' : font_size,
        'font-family'  : "script"
      });
  };

  // Draw hands
  my.hands = {
    second: new Hand(my, 0.00, 1.0, options.hands ),
    hour: new Hand(my, 0.07, 0.7, options.hands ),
    minute: new Hand(my, 0.05, 1.0, options.hands ),
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

  my.set_time = function(time, duration){
    // Set the clock to a particular time
    //
    //  time: defaults to the current time
    //  duration: milliseconds for animation.  Default 0.
    var time = moment(time);
    duration = duration || 0;
    my.hands.hour.rotate_to( ( (time.hour() % 12) * 5 ) + (time.minute() / 12), duration);
    my.hands.minute.rotate_to(time.minute() + (time.second() / 60), duration);
    my.hands.second.rotate_to(time.second(), duration);
  };

  my.start = function(){
    my.interval_id = setInterval(function(animation_speed){
        my.set_time(moment(), animation_speed);
      }, 
      500,  // Update every half-second    
      250   // animation speed (param to the function)
    );
  };

  my.stop = function(){
    if ( typeof my.interval_id !== "undefined" ){
      clearInterval(my.interval_id);
    }
  };

  my.stahp = my.stop;

};

Hand = function( clock, width_ratio, length_ratio, style ) {
  // clock: Clock() object to which this hand belongs.
  // width_ratio: width / clock radius (0..1)
  // length_ratio: hand length to clock radius (0..1)
  // style: optional hand style.  Defaults to 'simple', which draws triangular hands.
  my = this; 

  var half_width = clock.radius * width_ratio;
  var length = length_ratio * (clock.radius - clock.frame.attr('stroke-width'));
  style = style || 'simple';
  my.clock = clock;

  var pathstring = "";
  if ( style === 'simple' ) {
      // simple triangle shape
        pathstring = "M" + ( my.clock.center.x - half_width ) + "," + my.clock.center.y +
        "l" + half_width + "," + -length +
        "l" + half_width + "," + length +
        "z"

  } else if ( style === 'tear' ) {
      // A bit more rounded than a simple triangle
        pathstring = "M" + my.clock.center.x  + "," + my.clock.center.y +
        "q" + -half_width + ",0,0," + -length +
        "q" + half_width + "," + length + ",0," + length +
        "z"

  } else if ( style === 'diamond' ) {
      // A squat diamond shape
      var wide_part = 0.40; // The widest part of the diamond (0..1)
      pathstring = "M" +  clock.center.x + "," + clock.center.y +
        "l" + -half_width  + "," + (-length * wide_part) +
        "l" +  half_width  + "," + (-length * (1 - wide_part)) +
        "l" +  half_width  + "," + (length  * (1 - wide_part)) +
        "z";

  } else {
      console.log("Unknown style given for drawing hand: '%s'", style);
  };

  my.path = my.clock.paper.path(pathstring).attr({
      fill:   "90-#898-#000",
      stroke: "#444"
  });

};

Hand.prototype.rotate_to = function(clock_position, duration) {
  // rotate hand to a point on the clock
  //
  //  clock_position - number in range 1..60
  //  duration - Optional milliseconds for animation.  Defaults to 0.
  this.path.animate( 
    {
      transform: "R" + (clock_position * 6) + "," + this.clock.center.x + "," + this.clock.center.y 
    }, 
    duration || 0,
    "bounce"
  );

};
