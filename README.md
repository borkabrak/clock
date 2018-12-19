A Clock in Javascript/Raphael.  Just for fun.


Usage:
======
The Clock() constructor takes the following parameters:

  'container': The HTML element within which to draw the clock.

  'options': (defaults shown)

    * hands\_style Style in which to draw the hands.  Values include:
      - 'simple': A basic triangle shape.
      - 'tear': A more rounded taper vaguely reminiscent of a teardrop.
      - 'diamond': An angular, diamond shape.

    * font\_size(6): Size of font.  Larger value is a smaller font.

    * light\_source (0.25, 0.25): Direction from which the light appears to come.  If
      present, requires both x and y values, in range (0..1).


Bugs/TODO:
==============================================================================

* When rolling over past twelve, the hands move counter-clockwise from :59 to
  :00

* Add configuration options for:

  - Whether to use Roman or Arabic numerals.

  - Whether to show markings for individual minute/seconds

  - Colors for border, face, hands, center post, numerals..



Dependencies:
==============================================================================

* JQuery

* Raphael.js

* Moment.js

