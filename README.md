A Clock in Javascript/Raphael.  Just for fun.

Here's a [demo](http://borkabrak.org/clock)

Usage:
======
The Clock() constructor takes the following parameters:

  'container': The HTML element within which to draw the clock.

  'options': (defaults shown)

    * hands\_style ('simple'): One of a selection of styles in which to draw
      the hands.  Check Hand() constructor for values.

    * font\_size(6): Size of font.  Larger value is a smaller font.

    * light\_source (0.25, 0.25): Direction from which the light appears to come.  If
      present, requires both x and y values, in range (0..1).

Bugs/TODO:
==============================================================================

* When rolling over past twelve, the hands move counter-clockwise from :59 to
  :00

Dependencies:
==============================================================================

* Raphael.js


// Here's a string to use to play with git.  Cogito ergo sum.
