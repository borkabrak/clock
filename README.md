A Clock in Javascript/Raphael.  Just for fun.

Here's a [demo](http://borkabrak.org/clock)

Bugs/TODO:
==============================================================================

* Sometimes when loading the page, the numbers seem drawn over a smaller clock
  than the rest of the elements.  This seems to occur randomly, and may be
  some sort of race condition.

* When rolling over past twelve, the hands move counter-clockwise.

* Redraw the clock when the window resizes.

Dependencies:
==============================================================================

* Raphael.js
