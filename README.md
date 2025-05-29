AstronomyJS
===========

[![Build Status](https://travis-ci.org/alexandreribeiro/astronomy.js.svg?branch=master)](https://travis-ci.org/alexandreribeiro/astronomy.js)
[![Coverage Status](https://coveralls.io/repos/github/alexandreribeiro/astronomy.js/badge.svg?branch=master&service=github)](https://coveralls.io/github/alexandreribeiro/astronomy.js?branch=master)

Astronomical calculations in JavaScript.
You can see this project running at: <https://alexandreribeiro.github.io/astronomy-js/demo/>  
See an interactive demonstration in the `/demo` folder.

## Quick Start
Importing minified JavaScript in html

```javascript
<script type="text/javascript" src="astronomy-js.min.js"></script>
// latitude, longitude
let astronomyJS = AstronomyJS.initialize(56.2, 18.1)
// Sun, Mercury, Venus, etc.
astronomyJS.getAltAzCoordinatesForObject('Sun');
```

Using ES Module
```javascript
import { AstronomyJS } from "astronomy-js.es.js";
// latitude, longitude
let astronomyJS = AstronomyJS.initialize(56.2, 18.1)
// Sun, Mercury, Venus, etc.
astronomyJS.getAltAzCoordinatesForObject('Sun');
```

## Tests

`npm run test`

## Functions

- setDate
- setLocation
- getRADecCoordinatesForObject
- getHADecCoordinatesForObject
- getAltAzCoordinatesForObject
- getEphemerisDateForObject

## About

This library provides astronomical calculations for leisure purposes only.
Some important basic aspects are not implemented, such as:
- Atmospheric refraction
- Orbit perturbations

## References
US Naval Observatory, Explanatory Supplement to the Astronomical Almanac, 1992
