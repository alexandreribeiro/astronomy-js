/*! MIT License

Copyright (c) 2025 Alexandre Ribeiro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
const S = {
  EPHEMERIS_TYPE: {
    SUNRISE: {
      NAME: "SUNRISE",
      ALTITUDE: "-0.833",
      IS_GOING_UP: !0
    },
    SUNSET: {
      NAME: "SUNSET",
      ALTITUDE: "-0.833",
      IS_GOING_UP: !1
    },
    MOONRISE: {
      NAME: "MOONRISE",
      ALTITUDE: "-0.833",
      IS_GOING_UP: !0
    },
    MOONSET: {
      NAME: "MOONSET",
      ALTITUDE: "-0.833",
      IS_GOING_UP: !1
    },
    GOLDEN_HOUR_START: {
      NAME: "GOLDEN_HOUR_START",
      ALTITUDE: "6",
      IS_GOING_UP: !1
    },
    GOLDEN_HOUR_END: {
      NAME: "GOLDEN_HOUR_END",
      ALTITUDE: "6",
      IS_GOING_UP: !0
    },
    RISE: {
      NAME: "RISE",
      ALTITUDE: "0",
      IS_GOING_UP: !0
    },
    SET: {
      NAME: "SET",
      ALTITUDE: "0",
      IS_GOING_UP: !1
    },
    TRANSIT: {
      NAME: "TRANSIT",
      ALTITUDE: null,
      IS_GOING_UP: null
    },
    LOWER_TRANSIT: {
      NAME: "LOWER_TRANSIT",
      ALTITUDE: null,
      IS_GOING_UP: null
    },
    CIVIL_TWILIGHT_START: {
      NAME: "CIVIL_TWILIGHT_START",
      ALTITUDE: "-6",
      IS_GOING_UP: !0
    },
    CIVIL_TWILIGHT_END: {
      NAME: "CIVIL_TWILIGHT_END",
      ALTITUDE: "-6",
      IS_GOING_UP: !1
    },
    NAUTICAL_TWILIGHT_START: {
      NAME: "NAUTICAL_TWILIGHT_START",
      ALTITUDE: "-12",
      IS_GOING_UP: !0
    },
    NAUTICAL_TWILIGHT_END: {
      NAME: "NAUTICAL_TWILIGHT_END",
      ALTITUDE: "-12",
      IS_GOING_UP: !1
    },
    ASTRONOMICAL_TWILIGHT_START: {
      NAME: "ASTRONOMICAL_TWILIGHT_START",
      ALTITUDE: "-18",
      IS_GOING_UP: !0
    },
    ASTRONOMICAL_TWILIGHT_END: {
      NAME: "ASTRONOMICAL_TWILIGHT_END",
      ALTITUDE: "-18",
      IS_GOING_UP: !1
    }
  },
  MS_PER_DAY: 864e5,
  JULIAN_DAY_OFFSET: 24405875e-1,
  JULIAN_DAY_2000: 2451545,
  EPS: Math.pow(10, -9),
  NUMBERS_OF_ATTEMPT_TO_GET_POSITIONAL_EPHEMERIS: 5,
  DAYS_PER_JULIAN_CENTURY: 36525,
  METERS_PER_AU: 149597870700
};
class g {
  /**
   * @param {Date} referenceDate - reference date
   * @returns {number} - Julian date
   */
  static julianDate(t) {
    return t / S.MS_PER_DAY + S.JULIAN_DAY_OFFSET;
  }
  /**
   * @param {number} julianDate - Julian date
   * @returns {Date} - Date object
   */
  static julianDateToDate(t) {
    return new Date(
      (t - S.JULIAN_DAY_OFFSET) * S.MS_PER_DAY
    );
  }
  /**
   * @param {number} julianDate - Julian date
   * @returns {number} - number of Julian days since epoch J2000.0
   */
  static julianDaysSinceEpoch2000(t) {
    return t - S.JULIAN_DAY_2000;
  }
  /**
   * @param {number} julianDate - Julian date
   * @returns {number} - number of Julian centuries since epoch J2000.0
   */
  static julianCenturiesSinceEpoch2000(t) {
    return this.julianDaysSinceEpoch2000(t) / S.DAYS_PER_JULIAN_CENTURY;
  }
}
class r {
  /**
   * @param {number} degrees - angle in degrees
   * @returns {number} - angle in degrees
   */
  static modDegrees(t) {
    for (; t < 0; )
      t = t + 360;
    return t % 360;
  }
  /**
   * @param {number} degrees - angle in degrees
   * @returns {number} - angle in degrees, normalized to range [-180, 180)
   */
  static mod180Degrees(t) {
    const e = this.modDegrees(t);
    return e > 180 ? e - 360 : e;
  }
  /**
   * @param {number} radians - angle in radians
   * @returns {number} - angle in radians
   */
  static modRadians(t) {
    for (; t < 0; )
      t = t + 2 * Math.PI;
    return t % (2 * Math.PI);
  }
  /**
   * @param {number} radians - angle in radians
   * @returns {number} - angle in radians, normalized to range [-pi, pi)
   */
  static modPiRadians(t) {
    const e = this.modRadians(t);
    return e > Math.PI ? e - 2 * Math.PI : e;
  }
  /**
   * @param {number} radians - angle in radians
   * @returns {number} - angle in degrees
   */
  static radiansToDegrees(t) {
    return t * (180 / Math.PI);
  }
  /**
   * @param {number} degrees - angle in degrees
   * @returns {number} - angle in radians
   */
  static degreesToRadians(t) {
    return t * (Math.PI / 180);
  }
}
class N {
  constructor(t, e, n, s) {
    this.x = t, this.y = e, this.z = n, this.center = s;
  }
  /**
   * @param {EclipticRectangularCoordinates} eclipticRectangularCoordinates - ecliptic rectangular coordinates
   * @param {SolarSystemObject} center - reference frame
   * @returns {EclipticRectangularCoordinates} - difference between coordinates
   */
  minus(t, e) {
    return new N(
      this.x - t.x,
      this.y - t.y,
      this.z - t.z,
      e
    );
  }
}
class V {
  constructor(t, e, n, s) {
    this.lambda = t, this.beta = e, this.delta = n, this.center = s;
  }
}
class J {
  constructor(t, e, n, s, a) {
    this.rightAscension = t, this.declination = e, this.delta = n, this.obliquity = s, this.center = a;
  }
}
class $ {
  constructor(t, e, n, s) {
    this.azimuth = t, this.altitude = e, this.distance = n, this.observerLocation = s;
  }
}
class X {
  constructor(t, e, n, s) {
    this.rightAscension = t, this.declination = e, this.distance = n, this.observerLocation = s;
  }
}
class U {
  /**
   * @param {EclipticRectangularCoordinates} eclipticRectangularCoordinates - ecliptic rectangular coordinates
   * @returns {EclipticSphericalCoordinates} - ecliptic spherical coordinates
   */
  static eclipticRectangularToEclipticSphericalCoordinates(t) {
    const e = Math.sqrt(
      t.x * t.x + t.y * t.y + t.z * t.z
    ), n = Math.atan2(
      t.y,
      t.x
    ) * (180 / Math.PI), s = Math.asin(t.z / e) * (180 / Math.PI), a = (n + 360) % 360;
    return new V(
      a,
      s,
      e,
      t.center
    );
  }
  /**
   * @param {EclipticSphericalCoordinates} eclipticSphericalCoordinates - ecliptic spherical coordinates
   * @param {number} obliquity - obliquity of the ecliptic in degrees
   * @returns {EquatorialSphericalCoordinates} - equatorial spherical coordinates
   */
  static eclipticSphericalToEquatorialSphericalCoordinates(t, e) {
    const n = r.degreesToRadians(
      t.lambda
    ), s = r.degreesToRadians(
      t.beta
    ), a = r.degreesToRadians(e), o = Math.sin(s) * Math.cos(a) + Math.cos(s) * Math.sin(a) * Math.sin(n), i = Math.sin(n) * Math.cos(a) - Math.tan(s) * Math.sin(a), c = Math.cos(n), h = Math.atan2(i, c), d = r.modDegrees(
      r.radiansToDegrees(h)
    ), T = r.radiansToDegrees(
      Math.asin(o)
    );
    return new J(
      d,
      T,
      t.delta,
      e,
      t.center
    );
  }
  /**
   * @param {EquatorialSphericalCoordinates} equatorialSphericalCoordinates - equatorial spherical coordinates
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {number} localMeanSiderealTime - local sidereal time in degrees
   * @returns {TopocentricEquatorialSphericalCoordinates} - topocentric equatorial spherical coordinates
   */
  static equatorialSphericalToTopocentricEquatorialSphericalCoordinates(t, e, n) {
    const s = t.center.meanRadius, a = r.degreesToRadians(
      t.rightAscension
    ), o = r.degreesToRadians(
      t.declination
    ), i = r.degreesToRadians(
      e.latitude
    ), c = r.degreesToRadians(
      n
    ), h = Math.atan(
      (1 - t.center.flattening) * Math.tan(i)
    ), d = (1 - t.center.flattening) * Math.sin(h) + e.elevation / s * Math.sin(i), T = Math.cos(h) + e.elevation / s * Math.cos(i), E = Math.asin(
      t.center.meanRadius / S.METERS_PER_AU / t.delta
    ), O = c - a, D = Math.atan2(
      -T * Math.sin(E) * Math.sin(O),
      Math.cos(o) - T * Math.sin(E) * Math.cos(O)
    ), l = r.modDegrees(
      r.radiansToDegrees(
        a + D
      )
    ), L = r.radiansToDegrees(
      Math.atan2(
        (Math.sin(o) - d * Math.sin(E)) * Math.cos(D),
        Math.cos(o) - T * Math.sin(E) * Math.cos(O)
      )
    );
    return new X(
      l,
      L,
      null,
      e
    );
  }
  /**
   * @param {TopocentricEquatorialSphericalCoordinates} topocentricEquatorialSphericalCoordinates - topocentric equatorial spherical coordinates
   * @param {number} localMeanSiderealTime - local mean sidereal time in degrees
   * @returns {TopocentricHorizontalSphericalCoordinates} - topocentric horizontal spherical coordinates
   */
  static topocentricEquatorialToTopocentricHorizontalSphericalCoordinates(t, e) {
    const n = r.degreesToRadians(
      t.rightAscension
    ), s = r.degreesToRadians(
      t.declination
    ), a = r.degreesToRadians(
      t.observerLocation.latitude
    ), i = r.degreesToRadians(
      e
    ) - n, c = Math.asin(
      Math.sin(a) * Math.sin(s) + Math.cos(a) * Math.cos(s) * Math.cos(i)
    ), h = Math.atan2(
      Math.sin(i),
      Math.cos(i) * Math.sin(a) - Math.tan(s) * Math.cos(a)
    ), d = r.radiansToDegrees(c), T = r.modDegrees(
      r.radiansToDegrees(h) + 180
    );
    return new $(
      T,
      d,
      null,
      t.observerLocation
    );
  }
}
class Z {
  constructor(t, e, n) {
    this.hourAngle = t, this.declination = e, this.distance = n;
  }
}
class A {
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {TopocentricEquatorialSphericalCoordinates} - topocentric equatorial spherical coordinates
   */
  static getTopocentricEquatorialSphericalCoordinates(t, e, n) {
    const s = t.center.getRectangularHeliocentricCoordinates(n), a = e.getRectangularHeliocentricCoordinates(n), o = a.minus(
      s,
      a.center
    ), i = U.eclipticRectangularToEclipticSphericalCoordinates(
      o
    ), c = U.eclipticSphericalToEquatorialSphericalCoordinates(
      i,
      t.center.getObliquity(n)
    ), h = c.rightAscension, d = c.declination, T = c.delta, E = this.getLocalMeanSiderealTime(
      t,
      n
    ), O = new J(
      h,
      d,
      T,
      t.center.getObliquity(n),
      t.center
    );
    return U.equatorialSphericalToTopocentricEquatorialSphericalCoordinates(
      O,
      t,
      E
    );
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {TopocentricHorizontalSphericalCoordinates} - topocentric horizontal spherical coordinates
   */
  static getTopocentricHorizontalSphericalCoordinatesForSolarSystemObject(t, e, n) {
    const s = A.getTopocentricEquatorialSphericalCoordinates(
      t,
      e,
      n
    ), a = this.getLocalMeanSiderealTime(
      t,
      n
    );
    return U.topocentricEquatorialToTopocentricHorizontalSphericalCoordinates(
      s,
      a
    );
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {EclipticRectangularCoordinates} - rectangular object-centric coordinates
   */
  static getRectangularObjectCentricCoordinatesForSolarSystemObject(t, e, n) {
    return e.getRectangularHeliocentricCoordinates(n).minus(
      t.center.getRectangularHeliocentricCoordinates(
        n
      ),
      t.center
    );
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {EclipticRectangularCoordinates} - rectangular equatorial coordinates
   */
  static getRectangularEquatorialCoordinatesForSolarSystemObject(t, e, n) {
    const s = this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
      t,
      e,
      n
    ), a = r.degreesToRadians(
      t.center.axialTilt
    );
    return new N(
      s.x,
      s.y * Math.cos(a) - s.z * Math.sin(a),
      s.y * Math.sin(a) + s.z * Math.cos(a)
    );
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {number} - distance in astronomical units
   */
  static getDistanceToSolarSystemObject(t, e, n) {
    const s = this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
      t,
      e,
      n
    );
    return Math.sqrt(
      Math.pow(s.x, 2) + Math.pow(s.y, 2) + Math.pow(s.z, 2)
    );
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {TopocentricEquatorialHourAngleDeclinationCoordinates} - HA-Dec coordinates
   */
  static getHADecCoordinatesForSolarSystemObject(t, e, n) {
    const s = this.getTopocentricEquatorialSphericalCoordinates(
      t,
      e,
      n
    );
    return new Z(
      r.modDegrees(
        A.getLocalMeanSiderealTime(
          t,
          n
        ) - s.rightAscension
      ),
      s.declination,
      s.distance
    );
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {number} julianDate - Julian date
   * @returns {number} - local mean sidereal time in degrees
   */
  static getLocalMeanSiderealTime(t, e) {
    return r.modDegrees(
      t.center.getPrimeMeridianMeanSiderealTime(e) + t.longitude
    );
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {number} - transit time as an angle
   */
  static getObjectTransit(t, e, n) {
    const s = this.getTopocentricEquatorialSphericalCoordinates(
      t,
      e,
      n
    ).rightAscension;
    return this.getLocalMeanSiderealTime(t, n) - s;
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @returns {number} - lower transit time as an angle
   */
  static getObjectLowerTransit(t, e, n) {
    const s = this.getTopocentricEquatorialSphericalCoordinates(
      t,
      e,
      n
    ).rightAscension, a = this.getLocalMeanSiderealTime(t, n) - s - 180;
    return r.mod180Degrees(a);
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @param {number} altitude - altitude in degrees
   * @returns {number} - local hour angle in degrees
   */
  static getObjectLocalHourAngleForAltitude(t, e, n, s) {
    const a = r.degreesToRadians(
      t.latitude
    ), o = r.degreesToRadians(s), i = r.degreesToRadians(
      this.getTopocentricEquatorialSphericalCoordinates(
        t,
        e,
        n
      ).declination
    ), c = (Math.sin(o) - Math.sin(a) * Math.sin(i)) / (Math.cos(a) * Math.cos(i));
    return r.radiansToDegrees(Math.acos(c));
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} solarSystemObject - solar system object
   * @param {number} julianDate - Julian date
   * @param {object} ephemerisType - type of ephemeris
   * @returns {number} - iteration value as Julian date
   */
  static getIterationValueForPositionalEphemerisForObject(t, e, n, s) {
    if (s === S.EPHEMERIS_TYPE.TRANSIT)
      return n - this.getObjectTransit(t, e, n) / 15 / 24;
    if (s === S.EPHEMERIS_TYPE.LOWER_TRANSIT)
      return n - this.getObjectLowerTransit(
        t,
        e,
        n
      ) / 15 / 24;
    {
      const a = this.getObjectTransit(
        t,
        e,
        n
      ), o = this.getObjectLocalHourAngleForAltitude(
        t,
        e,
        n,
        s.ALTITUDE
      ), i = r.mod180Degrees(
        s.IS_GOING_UP ? a + o : a - o
      );
      return n - i / 15 / 24;
    }
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @param {object} ephemerisType - type of ephemeris
   * @returns {Date} - date of the ephemeris event
   */
  static iteratePositionalEphemerisForObject(t, e, n, s) {
    let a = this.getIterationValueForPositionalEphemerisForObject(
      t,
      e,
      n,
      s
    ), o = +a;
    for (let i = 0; i < 1e3 && !isNaN(a) && (a = this.getIterationValueForPositionalEphemerisForObject(
      t,
      e,
      a,
      s
    ), !(Math.abs(a - o) < 1e-5)); i++)
      o = a;
    return g.julianDateToDate(a);
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} otherSolarSystemObject - other solar system object
   * @param {number} julianDate - Julian date
   * @param {object} ephemerisType - type of ephemeris
   * @param {number} numberOfAttemptsLeft - number of attempts left
   * @returns {Date|null} - correct date of the ephemeris event or null if not found
   */
  static getCorrectDateForPositionalEphemeris(t, e, n, s, a) {
    const o = this.iteratePositionalEphemerisForObject(
      t,
      e,
      n,
      s
    );
    if (a > 0 && o.getDate() !== g.julianDateToDate(n).getDate()) {
      const i = g.julianDate(o), c = i > n ? -1 : 1;
      return this.getCorrectDateForPositionalEphemeris(
        t,
        e,
        i + c,
        s,
        a - 1
      );
    } else return a === 0 ? null : o;
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} solarSystemObject - solar system object
   * @param {number} julianDate - Julian date
   * @param {object} ephemerisType - type of ephemeris
   * @returns {Date|null} - date of the positional ephemeris or null if not found
   */
  static getDateForPositionalEphemeris(t, e, n, s) {
    return this.getCorrectDateForPositionalEphemeris(
      t,
      e,
      n,
      s,
      S.NUMBERS_OF_ATTEMPT_TO_GET_POSITIONAL_EPHEMERIS
    );
  }
  /**
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {SolarSystemObject} solarSystemObject - solar system object
   * @param {number} julianDate - Julian date
   * @returns {number} - fraction between 0 and 1 representing the illumination of the object
   */
  static getIlluminatedFractionForObject(t, e, n) {
    const s = t.center.getRectangularHeliocentricCoordinates(n), a = e.getRectangularHeliocentricCoordinates(n), o = {
      x: -a.x,
      y: -a.y,
      z: -a.z
    }, i = {
      x: s.x - a.x,
      y: s.y - a.y,
      z: s.z - a.z
    }, c = o.x * i.x + o.y * i.y + o.z * i.z, h = Math.sqrt(
      o.x * o.x + o.y * o.y + o.z * o.z
    ), d = Math.sqrt(
      i.x * i.x + i.y * i.y + i.z * i.z
    );
    return (1 + Math.max(
      -1,
      Math.min(
        1,
        c / (h * d)
      )
    )) / 2;
  }
}
class K {
  constructor(t, e) {
    this.skyObjectType = t, this.name = e;
  }
}
const I = {
  PLANET: "planet",
  SATELLITE: "satellite",
  SUN: "sun"
};
class M extends K {
  constructor(t, e, n, s, a, o) {
    super(t, e), this.orbitalParameters = n, this.meanRadius = s, this.axialTilt = a, this.flattening = o;
  }
  /**
   * @param {OrbitalParameters} orbitalParameters - orbital parameters
   * @param {number} julianDate - Julian date
   * @returns {EclipticRectangularCoordinates} - rectangular heliocentric coordinates
   */
  static getRectangularHeliocentricCoordinatesFromOrbitalParameters(t, e) {
    const n = g.julianCenturiesSinceEpoch2000(e), s = r.degreesToRadians(
      t.getInclination(n)
    ), a = r.degreesToRadians(
      t.getTrueAnomaly(n)
    ), o = r.degreesToRadians(
      t.getPerihelion(n)
    ), i = r.degreesToRadians(
      t.getAscendingNode(n)
    ), c = t.getOrbitRadius(n), h = a + o - i, d = c * (Math.cos(i) * Math.cos(h) - Math.sin(i) * Math.sin(h) * Math.cos(s)), T = c * (Math.sin(i) * Math.cos(h) + Math.cos(i) * Math.sin(h) * Math.cos(s)), E = c * (Math.sin(h) * Math.sin(s));
    return new N(d, T, E, null);
  }
  /**
   * @param {number} julianDate - Julian date
   * @returns {EclipticRectangularCoordinates} - rectangular heliocentric coordinates
   */
  getRectangularHeliocentricCoordinates(t) {
    return M.getRectangularHeliocentricCoordinatesFromOrbitalParameters(
      this.orbitalParameters,
      t
    );
  }
  getObliquity(t) {
    return this.axialTilt;
  }
  getPrimeMeridianMeanSiderealTime(t) {
    throw new Error("Not implemented");
  }
}
class m {
  /**
   * @constructor
   * @param {number} a0 - semi-major axis (AU)
   * @param {number} e0 - eccentricity
   * @param {number} i0 - inclination (degrees)
   * @param {number} o0 - longitude of the ascending node (degrees)
   * @param {number} w0 - longitude of perihelion (degrees)
   * @param {number} l0 - mean longitude (degrees)
   * @param {number} ac - semi-major axis centennial rate (AU per Julian century)
   * @param {number} ec - eccentricity (per Julian century)
   * @param {number} ic - inclination (arc seconds per Julian century)
   * @param {number} oc - longitude of the ascending node (arc seconds per Julian century)
   * @param {number} wc - longitude of perihelion (arc seconds per Julian century)
   * @param {number} lc - mean longitude (arc seconds per Julian century)
   */
  constructor(t, e, n, s, a, o, i, c, h, d, T, E) {
    this.a0 = t, this.e0 = e, this.i0 = n, this.o0 = s, this.w0 = a, this.l0 = o, this.ac = i, this.ec = c, this.ic = h, this.oc = d, this.wc = T, this.lc = E;
  }
  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - semi-major axis in AU
   */
  getSemiMajorAxis(t) {
    return this.a0 + this.ac * t;
  }
  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - eccentricity
   */
  getEccentricity(t) {
    return this.e0 + this.ec * t;
  }
  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - inclination in degrees
   */
  getInclination(t) {
    return r.modDegrees(
      this.i0 + this.ic / 3600 * t
    );
  }
  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - longitude of the ascending node in degrees
   */
  getAscendingNode(t) {
    return r.modDegrees(
      this.o0 + this.oc / 3600 * t
    );
  }
  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - longitude of perihelion in degrees
   */
  getPerihelion(t) {
    return r.modDegrees(
      this.w0 + this.wc / 3600 * t
    );
  }
  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - mean longitude in degrees
   */
  getMeanLongitude(t) {
    return r.modDegrees(
      this.l0 + this.lc / 3600 * t
    );
  }
  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - mean anomaly in degrees
   */
  getMeanAnomaly(t) {
    return r.modDegrees(
      this.getMeanLongitude(t) - this.getPerihelion(t)
    );
  }
  /**
   *
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - eccentric anomaly in degrees
   */
  getEccentricAnomaly(t) {
    const e = r.degreesToRadians(
      this.getMeanAnomaly(t)
    ), n = this.getEccentricity(t);
    let s = e + n * Math.sin(e) * (1 + n * Math.cos(e)), a = 0, o = 0, i = 0;
    for (; i++ < 1e4 && (a = s - (s - n * Math.sin(s) - e) / (1 - n * Math.cos(s)), o = a - s, s = a, !(Math.abs(o) <= S.EPS)); )
      ;
    return r.radiansToDegrees(a);
  }
  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - true anomaly in degrees
   */
  getTrueAnomaly(t) {
    const e = this.getEccentricity(t), n = r.degreesToRadians(
      this.getEccentricAnomaly(t)
    ), s = 2 * Math.atan(
      Math.sqrt((1 + e) / (1 - e)) * Math.tan(0.5 * n)
    );
    return r.radiansToDegrees(s);
  }
  /**
   * R = (a * (1 - e^2)) / (1 + e * cos(V))
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - orbit radius in AU
   */
  getOrbitRadius(t) {
    const e = this.getSemiMajorAxis(t), n = this.getEccentricity(t), s = this.getTrueAnomaly(t);
    return e * (1 - Math.pow(n, 2)) / (1 + n * Math.cos(r.degreesToRadians(s)));
  }
}
class Q extends M {
  constructor() {
    const t = new m(
      0.38709893,
      0.20563069,
      7.00487,
      48.33167,
      77.45645,
      252.25084,
      66e-8,
      2527e-8,
      -23.51,
      -446.3,
      573.57,
      53810162829e-2
    );
    super(I.PLANET, "Mercury", t, 2439700, 2.04);
  }
}
class tt extends M {
  constructor() {
    const t = new m(
      0.72333199,
      677323e-8,
      3.39471,
      76.68069,
      131.53298,
      181.97973,
      92e-8,
      -4938e-8,
      -2.86,
      -996.89,
      -108.8,
      21066413606e-2
    );
    super(I.PLANET, "Venus", t, 6051800, 2.64);
  }
}
class k extends M {
  constructor() {
    const t = new m(
      1.00000011,
      0.01671022,
      5e-5,
      -11.26064,
      102.94719,
      100.46435,
      -5e-8,
      -3804e-8,
      -46.94,
      -18228.25,
      1198.28,
      12959774063e-2
    );
    super(
      I.PLANET,
      "Earth",
      t,
      6378137,
      23.439281,
      1 / 298.257223563
    );
  }
  getObliquity(t) {
    const e = g.julianCenturiesSinceEpoch2000(t);
    return 23.43929111 - 46.815 * e / 3600 - 6e-4 * e * e / 3600 + 1813e-6 * e * e * e / 3600;
  }
  getPrimeMeridianMeanSiderealTime(t) {
    const e = g.julianDaysSinceEpoch2000(t), n = g.julianCenturiesSinceEpoch2000(t), s = 280.46061837 + 360.98564736629 * e + 387933e-9 * n * n - n * n * n / 3871e4;
    return r.modDegrees(s);
  }
}
class et extends M {
  constructor() {
    const t = new m(
      1.52366231,
      0.09341233,
      1.85061,
      49.57854,
      336.04084,
      355.45332,
      -7221e-8,
      11902e-8,
      -25.47,
      -1020.19,
      1560.78,
      6890510378e-2
    );
    super(I.PLANET, "Mars", t, 3389500, 25.19);
  }
}
class nt extends M {
  constructor() {
    const t = new m(
      5.20336301,
      0.04839266,
      1.3053,
      100.55615,
      14.75385,
      34.40438,
      60737e-8,
      -1288e-7,
      -4.15,
      1217.17,
      839.93,
      1092507835e-2
    );
    super(I.PLANET, "Jupiter", t, 69911e3, 3.13);
  }
}
class st extends M {
  constructor() {
    const t = new m(
      9.53707032,
      0.0541506,
      2.48446,
      113.71504,
      92.43194,
      49.94432,
      -30153e-7,
      -36762e-8,
      6.11,
      -1591.05,
      -1948.89,
      440105295e-2
    );
    super(I.PLANET, "Saturn", t, 58232e3, 26.73);
  }
}
class at extends M {
  constructor() {
    const t = new m(
      19.19126393,
      0.04716771,
      0.76986,
      74.22988,
      170.96424,
      313.23218,
      152025e-8,
      -1915e-7,
      -2.09,
      -1681.4,
      1312.56,
      154254779e-2
    );
    super(I.PLANET, "Uranus", t, 25362e3, 97.77);
  }
}
class it extends M {
  constructor() {
    const t = new m(
      30.06896348,
      858587e-8,
      1.76917,
      131.72169,
      44.97135,
      304.88003,
      -125196e-8,
      251e-7,
      -3.64,
      -151.25,
      -844.43,
      786449.21
    );
    super(I.PLANET, "Neptune", t, 24622e3, 28.32);
  }
}
const ot = [
  new Q(),
  new tt(),
  new k(),
  new et(),
  new nt(),
  new st(),
  new at(),
  new it()
];
class rt extends M {
  constructor() {
    const t = new m(
      39.48168677,
      0.24880766,
      17.14175,
      110.30347,
      113.76329,
      238.92881,
      -207e-10,
      6465e-8,
      501e-8,
      -37.033,
      7.765,
      145.2078
    );
    super(I.PLANET, "Pluto", t, 1188300, 122.53);
  }
}
const ct = [new rt()];
class lt extends M {
  constructor() {
    super(I.SATELLITE, "Moon", null, 1737400, 1.5424);
  }
  getRectangularHeliocentricCoordinates(t) {
    const e = g.julianCenturiesSinceEpoch2000(t), n = e * e, s = n * e, a = s * e, o = 218.3164477 + 481267.88123421 * e - 15786e-7 * n + s / 538841 - a / 65194e3, i = 297.8501921 + 445267.1114034 * e - 18819e-7 * n + s / 545868 - a / 113065e3, c = 357.5291092 + 35999.0502909 * e - 1536e-7 * n + s / 2449e4, h = 134.9633964 + 477198.8675055 * e + 87414e-7 * n + s / 69699 - a / 14712e3, d = 93.272095 + 483202.0175233 * e - 36539e-7 * n - s / 3526e3 + a / 86331e4, T = 119.75 + 131.849 * e, E = 53.09 + 479264.29 * e, O = 313.45 + 481266.484 * e, D = 1 - 2516e-6 * e - 74e-7 * n, l = (_) => _ * Math.PI / 180, L = [
      [0, 0, 1, 0, 6288774, -20905355],
      [2, 0, -1, 0, 1274027, -3699111],
      [2, 0, 0, 0, 658314, -2955968],
      [0, 0, 2, 0, 213618, -569925],
      [0, 1, 0, 0, -185116, 48888],
      [0, 0, 0, 2, -114332, -3149],
      [2, 0, -2, 0, 58793, 246158],
      [2, -1, -1, 0, 57066, -152138],
      [2, 0, 1, 0, 53322, -170733],
      [2, -1, 0, 0, 45758, -204596],
      [0, 1, -1, 0, -40923, -129620],
      [1, 0, 0, 0, -34720, 108743],
      [0, 1, 1, 0, -30383, 104755],
      [2, 0, 0, -2, 15327, 10321],
      [0, 0, 1, 2, -12528, 0],
      [0, 0, 1, -2, 10980, 79661],
      [4, 0, -1, 0, 10675, -34782],
      [0, 0, 3, 0, 10034, -23210],
      [4, 0, -2, 0, 8548, -21636],
      [2, 1, -1, 0, -7888, 24208],
      [2, 1, 0, 0, -6766, 30824],
      [1, 0, -1, 0, -5163, -8379],
      [1, 1, 0, 0, 4987, -16675],
      [2, -1, 1, 0, 4036, -12831],
      [2, 0, 2, 0, 3994, -10445],
      [4, 0, 0, 0, 3861, -11650],
      [2, 0, -3, 0, 3665, 14403],
      [0, 1, -2, 0, -2689, -7003],
      [2, 0, -1, 2, -2602, 0],
      [2, -1, -2, 0, 2390, 10056],
      [1, 0, 1, 0, -2348, 6322],
      [2, -2, 0, 0, 2236, -9884],
      [0, 1, 2, 0, -2120, 5751],
      [0, 2, 0, 0, -2069, 0],
      [2, -2, -1, 0, 2048, -4950],
      [2, 0, 1, -2, -1773, 4130],
      [2, 0, 0, 2, -1595, 0],
      [4, -1, -1, 0, 1215, -3958],
      [0, 0, 2, 2, -1110, 0],
      [3, 0, -1, 0, -892, 3258],
      [2, 1, 1, 0, -810, 2616],
      [4, -1, -2, 0, 759, -1897],
      [0, 2, -1, 0, -713, -2117],
      [2, 2, -1, 0, -700, 2354],
      [2, 1, -2, 0, 691, 0],
      [2, -1, 0, -2, 596, 0],
      [4, 0, 1, 0, 549, -1423],
      [0, 0, 4, 0, 537, -1117],
      [4, -1, 0, 0, 520, -1571],
      [1, 0, -2, 0, -487, -1739],
      [2, 1, 0, -2, -399, 0],
      [0, 0, 2, -2, -381, -4421],
      [1, 1, 1, 0, 351, 0],
      [3, 0, -2, 0, -340, 0],
      [4, 0, -3, 0, 330, 0],
      [2, -1, 2, 0, 327, 0],
      [0, 2, 1, 0, -323, 1165],
      [1, 1, -1, 0, 299, 0],
      [2, 0, 3, 0, 294, 0],
      [2, 0, -1, -2, 0, 8752]
    ], Y = [
      [0, 0, 0, 1, 5128122],
      [0, 0, 1, 1, 280602],
      [0, 0, 1, -1, 277693],
      [2, 0, 0, -1, 173237],
      [2, 0, -1, 1, 55413],
      [2, 0, -1, -1, 46271],
      [2, 0, 0, 1, 32573],
      [0, 0, 2, 1, 17198],
      [2, 0, 1, -1, 9266],
      [0, 0, 2, -1, 8822],
      [2, -1, 0, -1, 8216],
      [2, 0, -2, -1, 4324],
      [2, 0, 1, 1, 4200],
      [2, 1, 0, -1, -3359],
      [2, -1, -1, 1, 2463],
      [2, -1, 0, 1, 2211],
      [2, -1, -1, -1, 2065],
      [0, 1, -1, -1, -1870],
      [4, 0, -1, -1, 1828],
      [0, 1, 0, 1, -1794],
      [0, 0, 0, 3, -1749],
      [0, 1, -1, 1, -1565],
      [1, 0, 0, 1, -1491],
      [0, 1, 1, 1, -1475],
      [0, 1, 1, -1, -1410],
      [0, 1, 0, -1, -1344],
      [1, 0, 0, -1, -1335],
      [0, 0, 3, 1, 1107],
      [4, 0, 0, -1, 1021],
      [4, 0, -1, 1, 833],
      [0, 0, 1, -3, 777],
      [4, 0, -2, 1, 671],
      [2, 0, 0, -3, 607],
      [2, 0, 2, -1, 596],
      [2, -1, 1, -1, 491],
      [2, 0, -2, 1, -451],
      [0, 0, 3, -1, 439],
      [2, 0, 2, 1, 422],
      [2, 0, -3, -1, 421],
      [2, 1, -1, 1, -366],
      [2, 1, 0, 1, -351],
      [4, 0, 0, 1, 331],
      [2, -1, 1, 1, 315],
      [2, -2, 0, -1, 302],
      [0, 0, 1, 3, -283],
      [2, 1, 1, -1, -229],
      [1, 1, 0, -1, 223],
      [1, 1, 0, 1, 223],
      [0, 1, -2, -1, -220],
      [2, 1, -1, -1, -220],
      [1, 0, 1, 1, -185],
      [2, -1, -2, -1, 181],
      [0, 1, 2, 1, -177],
      [4, 0, -2, -1, 176],
      [4, -1, -1, -1, 166],
      [1, 0, 1, -1, -164],
      [4, 0, 1, -1, 132],
      [1, 0, -1, -1, -119],
      [4, -1, 0, -1, 115],
      [2, -2, 0, 1, 107]
    ];
    let y = 0;
    for (const [_, R, P, b, p, w] of L) {
      const x = _ * l(i) + R * l(c) + P * l(h) + b * l(d);
      y += p * Math.pow(D, Math.abs(R)) * Math.sin(x);
    }
    let z = 0;
    for (const [_, R, P, b, p, w] of L) {
      const x = _ * l(i) + R * l(c) + P * l(h) + b * l(d);
      z += w * Math.pow(D, Math.abs(R)) * Math.cos(x);
    }
    let j = 0;
    for (const [_, R, P, b, p] of Y) {
      const w = _ * l(i) + R * l(c) + P * l(h) + b * l(d);
      j += p * Math.pow(D, Math.abs(R)) * Math.sin(w);
    }
    y = y + 3958 * Math.sin(l(T)) + 1962 * Math.sin(l(o - d)) + 318 * Math.sin(l(E)), j = j - 2235 * Math.sin(l(o)) + 382 * Math.sin(l(O)) + 175 * Math.sin(l(T - d)) + 175 * Math.sin(l(T + d)) + 127 * Math.sin(l(o - h)) - 115 * Math.sin(l(o + h));
    let W = o + y / 1e6, v = j / 1e6, B = 385000.56 + z / 1e3, q = l(W), C = l(v), H = B / 1495978707e-1;
    const G = {
      x: H * Math.cos(C) * Math.cos(q),
      y: H * Math.cos(C) * Math.sin(q),
      z: H * Math.sin(C)
    }, F = new k().getRectangularHeliocentricCoordinates(t);
    return new N(
      F.x + G.x,
      F.y + G.y,
      F.z + G.z
    );
  }
}
const ht = [new lt()];
class ut extends M {
  constructor() {
    super(I.SUN, "Sun", null, 695508e3, 0);
  }
  getRectangularHeliocentricCoordinates(t) {
    return new N(0, 0, 0, this);
  }
}
const dt = [new ut()].concat(ot).concat(ht).concat(ct);
class Tt {
  constructor(t, e, n, s) {
    this.longitude = t, this.latitude = e, this.elevation = n, this.center = s;
  }
}
class f {
  constructor() {
    this.skyObjects = [...dt], this.observerLocation = null, this.julianDate = null, this.simulationDate = null;
  }
  /**
   * @param {number} latitude - latitude in degrees
   * @param {number} longitude - longitude in degrees
   * @returns {AstronomyJS} - initialized AstronomyJS instance
   */
  static initialize(t, e) {
    let n = new f();
    return n.setLocation("Earth", t, e, 0), n.setDate(/* @__PURE__ */ new Date()), n;
  }
  /**
   * @returns {number|null} - current Julian date or null if not set
   */
  getJulianDate() {
    return this.julianDate;
  }
  /**
   * @param {number} julianDate - new Julian date
   */
  setJulianDate(t) {
    this.julianDate = t;
  }
  /**
   * @returns {Date|null} - current simulation date or null if not set
   */
  getDate() {
    return this.simulationDate;
  }
  /**
   * @param {Date} newDate - new date
   */
  setDate(t) {
    this.simulationDate = t, this.setJulianDate(g.julianDate(t));
  }
  /**
   * @param {string} objectName - name of the object
   * @returns {SolarSystemObject|null} - solar system object or null if not found
   */
  getSkyObjectByName(t) {
    return this.skyObjects.find((e) => e.name === t) || null;
  }
  /**
   * @param {string} objectName - name of the ephemeris type
   * @returns {object|null} - ephemeris type object or null if not found
   */
  getEphemerisTypeByName(t) {
    return Object.values(S.EPHEMERIS_TYPE).find(
      (e) => e.NAME === t
    ) || null;
  }
  /**
   * @param {string} objectName - name of the object to set location on
   * @param {number} latitude - latitude in degrees
   * @param {number} longitude - longitude in degrees
   * @param {number} elevationFromObjectSurface - elevation from surface in meters
   */
  setLocation(t, e, n, s) {
    const a = this.getSkyObjectByName(t);
    if (!a)
      throw new Error(`Solar system object "${t}" not found`);
    this.observerLocation = new Tt(
      n,
      e,
      s,
      a
    );
  }
  /**
   * @param {string} objectName - name of the object
   * @param {Date} [referenceDate] - optional reference date
   * @returns {TopocentricEquatorialSphericalCoordinates} - Right Ascension and Declination coordinates
   */
  getRightAscensionDeclinationCoordinatesForObject(t, e) {
    const n = this.getSkyObjectByName(t);
    if (!n || this.julianDate === null)
      throw new Error("Invalid object name or Julian date not set");
    const s = e ? g.julianDate(e) : this.julianDate;
    return A.getTopocentricEquatorialSphericalCoordinates(
      this.observerLocation,
      n,
      s
    );
  }
  /**
   * @param {string} objectName - name of the object
   * @param {Date} [referenceDate] - optional reference date
   * @returns {TopocentricEquatorialHourAngleDeclinationCoordinates} - Hour Angle and Declination coordinates
   */
  getHourAngleDeclinationCoordinatesForObject(t, e) {
    const n = this.getSkyObjectByName(t);
    if (!n || this.julianDate === null)
      throw new Error("Invalid object name or Julian date not set");
    const s = e ? g.julianDate(e) : this.julianDate;
    return A.getHADecCoordinatesForSolarSystemObject(
      this.observerLocation,
      n,
      s
    );
  }
  /**
   * @param {string} objectName - name of the object
   * @param {Date} [referenceDate] - optional reference date
   * @returns {TopocentricHorizontalSphericalCoordinates} - Altitude and Azimuth coordinates
   */
  getAltitudeAzimuthCoordinatesForObject(t, e) {
    const n = this.getSkyObjectByName(t);
    if (!n)
      throw new Error(`Object "${t}" not found`);
    const s = e ? g.julianDate(e) : this.julianDate;
    return A.getTopocentricHorizontalSphericalCoordinatesForSolarSystemObject(
      this.observerLocation,
      n,
      s
    );
  }
  /**
   * @param {string} objectName - name of the object
   * @param {Date} [referenceDate] - optional reference date
   * @returns {number} - fraction between 0 and 1 representing the illumination of the object
   */
  getIlluminatedFractionForObject(t, e) {
    const n = this.getSkyObjectByName(t);
    if (!n)
      throw new Error(`Object "${t}" not found`);
    const s = e ? g.julianDate(e) : this.julianDate;
    return A.getIlluminatedFractionForObject(
      this.observerLocation,
      n,
      s
    );
  }
  /**
   * @returns {number} - local mean sidereal time in degrees
   */
  getLocalMeanSiderealTime() {
    if (this.julianDate === null)
      throw new Error("Julian date not set");
    return A.getLocalMeanSiderealTime(
      this.observerLocation,
      this.julianDate
    );
  }
  /**
   * @param {string} objectName - name of the object
   * @param {Date} referenceDate - reference date
   * @param {string} ephemerisTypeName - name of the ephemeris type
   * @returns {Date|null} - date of the ephemeris event or null if not found
   */
  getEphemerisDateForObject(t, e, n) {
    const s = this.getSkyObjectByName(t), a = this.getEphemerisTypeByName(n);
    if (!s || !a)
      throw new Error("Invalid object name or ephemeris type");
    return A.getDateForPositionalEphemeris(
      this.observerLocation,
      s,
      g.julianDate(e),
      a
    );
  }
  /**
   * @returns {ObserverLocation|null} - current observer location or null if not set
   */
  getObserverLocation() {
    return this.observerLocation;
  }
  /**
   * @returns {{latitude: number, longitude: number}|null} - current observer coordinates or null if not set
   */
  getLatitudeLongitudeCoordinates() {
    return this.observerLocation ? {
      latitude: this.observerLocation.latitude,
      longitude: this.observerLocation.longitude
    } : null;
  }
}
function gt(u, t) {
  return f.initialize(u, t);
}
export {
  f as AstronomyJS,
  gt as initialize
};
