class Clock {
  constructor(container, options) {
    // container: the HTML element within which to draw the clock
    //
    // options:
    //
    //    * hands_style: One of a selection of styles in which to draw the
    //      hands.  Check Hand() constructor for values.
    //
    //    * font_size(6): Size of font.  Larger value is a smaller font.
    //
    //    * light_source (0.25, 0.25): Direction from which the light appears to come.  If
    //      present, requires both x and y values, in range (0..1).

    if (typeof container === "string") {
      container = document.querySelector(container);
    }

    if (! container instanceof HTMLDivElement) {
      console.error("Unknown container: %o", container);
    };
    /*******************************************************************/
    // Default option settings, over which declared values are merged.
    /*******************************************************************/
    options = {...{

      numerals: "roman",

      hands_style:"simple",

      font_size: 6,

    }, ...options};
    /*******************************************************************/

    var numeral_sets = {
      "roman" : [ null, "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",  "XI", "XII" ],
      "arabic": [ null, "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" ]
    };

    this.numerals = numeral_sets[options.numerals];

    // Make the canvas a square that fits in the window
    var size = (document.width >= document.height ? document.height : document.width) * 0.8;
    this.paper = this.paper || new Raphael(container , size, size);

    this.center = {
        x: (this.paper.width / 2),
        y: (this.paper.height / 2)
    };

    this.radius = (this.paper.width >= this.paper.height ? this.paper.height : this.paper.width) / 2 - 20;

    // Light source direction (for radial gradients)
    var light_source = options.light_source ? options.light_source : {
      x: 0.25,
      y: 0.25
    };

    // Frame
    this.frame = this.paper.circle(this.center.x, this.center.y, this.radius)
    .attr({
      'stroke-width'  : this.radius * 0.1,
      'stroke'        : '#404840',
      'fill'          : 'r(' + light_source.x + ',' + light_source.y + ')#fff-#668'
    });

    // Numbers
    for (var n = 1; n <= 12; n++) {

      var font_size = this.radius / (options.font_size);
      var x = this.center.x;
      var y = this.center.y - this.radius + this.frame.attr('stroke-width') + font_size * 0.7;
      var degrees = 360 / 12 * n;

      // Create the number (initially at the 12 o'clock position)
      this.paper.text( x, y, this.numerals[n] )

      // Move it around to its proper place.. (and keep it upright)
      .transform("r" + degrees + "," + this.center.x + "," + this.center.y + "r-" + degrees)

      // And twiddle its appearance
      .attr(
        {
          'font-size' : font_size,
          'font-family'  : "script"
        });
    };


    // Draw hands
    this.hands = {
      second: new Hand(this, 0.00, 1.0, options.hands_style ),
      hour: new Hand(this, 0.07, 0.7, options.hands_style ),
      minute: new Hand(this, 0.05, 1.0, options.hands_style ),
    };

    // Center post
    this.center_post = this.paper.circle(
      this.center.x,
      this.center.y,
      this.radius * 0.09
    ).attr({
      'fill'          : 'r(' + light_source.x + ',' + light_source.y + ')#fff-#aa4',
      'stroke'        : 'none'
    });

  }

  start(){
    let my = this;
    my.interval_id = setInterval(function(animation_speed) {
        var time = moment(time);
        var duration = 250;
        my.hands.hour.rotate_to( ( (time.hour() % 12) * 5 ) + (time.minute() / 12), duration);
        my.hands.minute.rotate_to(time.minute() + (time.second() / 60), duration);
        my.hands.second.rotate_to(time.second(), duration);
      },
      500,  // Update every half-second
      250   // animation speed (param to the function)
    );
  }

  stop(){
    if ( typeof this.interval_id !== "undefined" ){
      clearInterval(this.interval_id);
    }
  }

};

Hand = function( clock, width_ratio, length_ratio, style ) {
  // clock: Clock() object to which this hand belongs.
  // width_ratio: width / clock radius (0..1)
  // length_ratio: hand length to clock radius (0..1)
  // style: hand style

  var half_width = clock.radius * width_ratio;
  var length = length_ratio * (clock.radius - clock.frame.attr('stroke-width'));
  this.clock = clock;

  var pathstring = "";
  if ( style === 'simple' ) {
      // simple triangle shape
        pathstring = "M" + ( this.clock.center.x - half_width ) + "," + this.clock.center.y +
        "l" + half_width + "," + -length +
        "l" + half_width + "," + length +
        "z"

  } else if ( style === 'tear' ) {
      // A bit more rounded than a simple triangle
        pathstring = "M" + this.clock.center.x  + "," + this.clock.center.y +
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

  this.path = this.clock.paper.path(pathstring).attr({
      fill:   "90-#898-#000",
      stroke: "#444"
  });

};

Hand.prototype.rotate_to = function(clock_position, duration) {
  // rotate hand to a point on the clock
  //
  //  clock_position - number in range 1..60
  //  duration - milliseconds for animation
  this.path.animate(
    {
      transform: "R" + (clock_position * 6) + "," + this.clock.center.x + "," + this.clock.center.y
    },
    duration,
    "bounce"
  );

};
