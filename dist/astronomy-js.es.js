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
const E = {
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
class A {
  static julianDate(t) {
    return t / E.MS_PER_DAY + E.JULIAN_DAY_OFFSET;
  }
  static julianDateToDate(t) {
    return new Date(
      (t - E.JULIAN_DAY_OFFSET) * E.MS_PER_DAY
    );
  }
  static julianDaysSinceEpoch2000(t) {
    return t - E.JULIAN_DAY_2000;
  }
  static julianCenturiesSinceEpoch2000(t) {
    return this.julianDaysSinceEpoch2000(t) / E.DAYS_PER_JULIAN_CENTURY;
  }
}
class i {
  static modDegrees(t) {
    for (; t < 0; )
      t = t + 360;
    return t % 360;
  }
  static mod180Degrees(t) {
    const e = this.modDegrees(t);
    return e > 180 ? e - 360 : e;
  }
  static modRadians(t) {
    for (; t < 0; )
      t = t + 2 * Math.PI;
    return t % (2 * Math.PI);
  }
  static modPiRadians(t) {
    const e = this.modRadians(t);
    return t > Math.PI ? e - 2 * Math.PI : e;
  }
  static radiansToDegrees(t) {
    return t * (180 / Math.PI);
  }
  static degreesToRadians(t) {
    return t * (Math.PI / 180);
  }
  static padZero(t) {
    return t = t.toString(), t.length >= 2 ? t : "0" + t;
  }
}
class V {
  constructor(t, e, s, a) {
    this.longitude = t, this.latitude = e, this.elevation = s, this.center = a;
  }
}
class P {
  constructor(t, e, s) {
    this.latitude = t, this.longitude = e, this.radius = s;
  }
  toDegrees() {
    let t = this.latitude, e = this.longitude;
    return new P(
      `${t < 0 ? "-" : ""}${i.padZero(0 | (t < 0 ? t = -t : t))}° ${i.padZero(0 | t % 1 * 60)}' ${i.padZero(0 | t * 60 % 1 * 60)}''`,
      `${e < 0 ? "-" : ""}${i.padZero(0 | (e < 0 ? e = -e : e))}° ${i.padZero(0 | e % 1 * 60)}' ${i.padZero(0 | e * 60 % 1 * 60)}''`,
      this.radius
    );
  }
  toHours() {
    let t = this.latitude, e = this.longitude;
    return new P(
      `${t < 0 ? "-" : ""}${i.padZero(0 | (t < 0 ? t = -t : t))}° ${i.padZero(0 | t % 1 * 60)}' ${i.padZero(0 | t * 60 % 1 * 60)}''`,
      `${e < 0 ? "-" : ""}${i.padZero(0 | (e < 0 ? e = -e / 15 : e = e / 15))}h ${i.padZero(0 | e % 1 * 60)}m ${i.padZero(0 | e * 60 % 1 * 60)}s`,
      this.radius
    );
  }
}
class N {
  constructor(t, e, s, a) {
    this.x = t, this.y = e, this.z = s, this.center = a;
  }
  /**
   * @param {EclipticRectangularCoordinates} eclipticRectangularCoordinates
   * @param {SolarSystemObject} center
   * @returns {EclipticRectangularCoordinates}
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
class v {
  constructor(t, e, s, a) {
    this.lambda = t, this.beta = e, this.delta = s, this.center = a;
  }
}
class $ {
  constructor(t, e, s, a, n) {
    this.rightAscension = t, this.declination = e, this.delta = s, this.obliquity = a, this.center = n;
  }
}
class X {
  constructor(t, e, s) {
    this.rightAscension = t, this.declination = e, this.distance = s;
  }
}
class K {
  constructor(t, e, s) {
    this.azimuth = t, this.altitude = e, this.distance = s;
  }
}
class U {
  /*
   * @param {EclipticRectangularCoordinates} eclipticRectangularCoordinates
   * @returns {EclipticSphericalCoordinates}
   */
  static eclipticRectangularCoordinatesToEclipticSphericalCoordinates(t) {
    const e = Math.sqrt(
      t.x * t.x + t.y * t.y + t.z * t.z
    ), s = Math.atan2(
      t.y,
      t.x
    ) * (180 / Math.PI), a = Math.asin(t.z / e) * (180 / Math.PI), n = (s + 360) % 360;
    return new v(
      n,
      a,
      e,
      t.center
    );
  }
  /*
   * @param {EclipticSphericalCoordinates} eclipticSphericalCoordinates
   * @param {number} obliquity - obliquity of the ecliptic in degrees
   * @returns {EquatorialSphericalCoordinates}
   */
  static eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(t, e) {
    const s = i.degreesToRadians(
      t.lambda
    ), a = i.degreesToRadians(
      t.beta
    ), n = i.degreesToRadians(e), o = Math.sin(a) * Math.cos(n) + Math.cos(a) * Math.sin(n) * Math.sin(s), r = Math.sin(s) * Math.cos(n) - Math.tan(a) * Math.sin(n), c = Math.cos(s), d = Math.atan2(r, c), u = i.modDegrees(
      i.radiansToDegrees(d)
    ), T = i.radiansToDegrees(Math.asin(o));
    return new $(
      u,
      T,
      t.delta,
      e,
      t.center
    );
  }
  /**
   * @param {EquatorialSphericalCoordinates} equatorialSphericalCoordinates
   * @param {number} observerLatitude - geographic latitude of the observer in degrees
   * @param {number} observerElevation - elevation of the observer in meters
   * @param {number} localMeanSiderealTime - local sidereal time in degrees
   * @returns {TopocentricEquatorialSphericalCoordinates}
   */
  static equatorialSphericalGeocentricToEquatorialSphericalTopocentric(t, e, s, a) {
    const n = t.center.meanRadius, o = i.degreesToRadians(
      t.rightAscension
    ), r = i.degreesToRadians(
      t.declination
    ), c = i.degreesToRadians(e), d = i.degreesToRadians(
      a
    ), u = Math.atan(
      (1 - t.center.flattening) * Math.tan(c)
    ), T = (1 - t.center.flattening) * Math.sin(u) + s / n * Math.sin(c), g = Math.cos(u) + s / n * Math.cos(c), R = Math.asin(
      t.center.meanRadius / E.METERS_PER_AU / t.delta
    ), S = d - o, l = Math.atan2(
      -g * Math.sin(R) * Math.sin(S),
      Math.cos(r) - g * Math.sin(R) * Math.cos(S)
    ), y = i.modDegrees(
      i.radiansToDegrees(
        o + l
      )
    ), H = i.radiansToDegrees(
      Math.atan2(
        (Math.sin(r) - T * Math.sin(R)) * Math.cos(l),
        Math.cos(r) - g * Math.sin(R) * Math.cos(S)
      )
    );
    return new X(
      y,
      H
    );
  }
  /**
   * @param {TopocentricEquatorialSphericalCoordinates} equatorialSphericalTopocentricCoordinates
   * @param {number} observerLatitude - geographic latitude of the observer in degrees
   * @param localMeanSiderealTime
   * @returns {HorizontalSphericalCoordinates}
   */
  static equatorialSphericalTopocentricToHorizontalSphericalCoordinates(t, e, s) {
    const a = i.degreesToRadians(
      t.rightAscension
    ), n = i.degreesToRadians(
      t.declination
    ), o = i.degreesToRadians(e), c = i.degreesToRadians(
      s
    ) - a, d = Math.asin(
      Math.sin(o) * Math.sin(n) + Math.cos(o) * Math.cos(n) * Math.cos(c)
    ), u = Math.atan2(
      Math.sin(c),
      Math.cos(c) * Math.sin(o) - Math.tan(n) * Math.cos(o)
    ), T = i.radiansToDegrees(d), g = i.modDegrees(
      i.radiansToDegrees(u) + 180
    );
    return new K(g, T);
  }
}
class m {
  /**
   * @constructor
   * @param a0 semi-major axis (AU)
   * @param e0 eccentricity
   * @param i0 inclination (degrees)
   * @param o0 longitude of the ascending node (degrees)
   * @param w0 longitude of perihelion (degrees)
   * @param l0 mean longitude (degrees)
   * @param ac semi-major axis centennial rate (AU per Julian century)
   * @param ec eccentricity (per Julian century)
   * @param ic inclination (arc seconds per Julian century)
   * @param oc longitude of the ascending node (arc seconds per Julian century)
   * @param wc longitude of perihelion (arc seconds per Julian century)
   * @param lc mean longitude (arc seconds per Julian century)
   */
  constructor(t, e, s, a, n, o, r, c, d, u, T, g) {
    this.a0 = t, this.e0 = e, this.i0 = s, this.o0 = a, this.w0 = n, this.l0 = o, this.ac = r, this.ec = c, this.ic = d, this.oc = u, this.wc = T, this.lc = g;
  }
  /**
   * @param julianCenturiesSinceEpoch2000
   * @returns a - semi major axis
   */
  getSemiMajorAxis(t) {
    return this.a0 + this.ac * t;
  }
  /**
   * @param julianCenturiesSinceEpoch2000
   * @returns e - eccentricity
   */
  getEccentricity(t) {
    return this.e0 + this.ec * t;
  }
  getInclination(t) {
    return i.modDegrees(
      this.i0 + this.ic / 3600 * t
    );
  }
  getAscendingNode(t) {
    return i.modDegrees(
      this.o0 + this.oc / 3600 * t
    );
  }
  getPerihelion(t) {
    return i.modDegrees(
      this.w0 + this.wc / 3600 * t
    );
  }
  getMeanLongitude(t) {
    return i.modDegrees(
      this.l0 + this.lc / 3600 * t
    );
  }
  getMeanAnomaly(t) {
    return i.modDegrees(
      this.getMeanLongitude(t) - this.getPerihelion(t)
    );
  }
  /**
   *
   * @param julianCenturiesSinceEpoch2000
   * @returns {*} E: eccentric anomaly
   */
  getEccentricAnomaly(t) {
    const e = i.degreesToRadians(
      this.getMeanAnomaly(t)
    ), s = this.getEccentricity(t);
    let a = e + s * Math.sin(e) * (1 + s * Math.cos(e)), n = 0, o = 0, r = 0;
    for (; r++ < 1e4 && (n = a - (a - s * Math.sin(a) - e) / (1 - s * Math.cos(a)), o = n - a, a = n, !(Math.abs(o) <= E.EPS)); )
      ;
    return i.radiansToDegrees(n);
  }
  /**
   * @param julianCenturiesSinceEpoch2000
   * @returns V: true anomaly
   */
  getTrueAnomaly(t) {
    const e = this.getEccentricity(t), s = i.degreesToRadians(
      this.getEccentricAnomaly(t)
    ), a = 2 * Math.atan(
      Math.sqrt((1 + e) / (1 - e)) * Math.tan(0.5 * s)
    );
    return i.radiansToDegrees(a);
  }
  /**
   * R = (a * (1 - e^2)) / (1 + e * cos(V))
   * @param julianCenturiesSinceEpoch2000
   * @returns R: orbit radius
   */
  getOrbitRadius(t) {
    const e = this.getSemiMajorAxis(t), s = this.getEccentricity(t), a = this.getTrueAnomaly(t);
    return e * (1 - Math.pow(s, 2)) / (1 + s * Math.cos(i.degreesToRadians(a)));
  }
}
const I = {
  PLANET: "planet",
  STAR: "star",
  SATELLITE: "satellite"
};
class Q {
  constructor(t, e) {
    this.skyObjectType = t, this.name = e;
  }
}
class M extends Q {
  constructor(t, e, s, a, n, o) {
    super(t, e), this.orbitalParameters = s, this.meanRadius = a, this.axialTilt = n, this.flattening = o;
  }
  /**
   * @param orbitalParameters
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
   */
  static getRectangularHeliocentricCoordinatesFromOrbitalParameters(t, e) {
    const s = A.julianCenturiesSinceEpoch2000(e), a = i.degreesToRadians(
      t.getInclination(s)
    ), n = i.degreesToRadians(
      t.getTrueAnomaly(s)
    ), o = i.degreesToRadians(
      t.getPerihelion(s)
    ), r = i.degreesToRadians(
      t.getAscendingNode(s)
    ), c = t.getOrbitRadius(s), d = n + o - r, u = c * (Math.cos(r) * Math.cos(d) - Math.sin(r) * Math.sin(d) * Math.cos(a)), T = c * (Math.sin(r) * Math.cos(d) + Math.cos(r) * Math.sin(d) * Math.cos(a)), g = c * (Math.sin(d) * Math.sin(a));
    return new N(u, T, g, null);
  }
  /**
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
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
class B extends M {
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
    const e = A.julianCenturiesSinceEpoch2000(t);
    return 23.43929111 - 46.815 * e / 3600 - 6e-4 * e * e / 3600 + 1813e-6 * e * e * e / 3600;
  }
  getPrimeMeridianMeanSiderealTime(t) {
    const e = A.julianDaysSinceEpoch2000(t), s = A.julianCenturiesSinceEpoch2000(t), a = 280.46061837 + 360.98564736629 * e + 387933e-9 * s * s - s * s * s / 3871e4;
    return i.modDegrees(a);
  }
}
class _ {
  static getHorizontalSphericalCoordinatesForSolarSystemObject(t, e, s) {
    const a = t.center.getRectangularHeliocentricCoordinates(s), n = e.getRectangularHeliocentricCoordinates(s), o = n.minus(
      a,
      n.center
    ), r = U.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
      o
    ), c = U.eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(
      r,
      t.center.getObliquity(s)
    ), d = c.rightAscension, u = c.declination, T = c.delta, g = this.getLocalMeanSiderealTime(
      t,
      s
    ), R = new $(
      d,
      u,
      T,
      t.center.getObliquity(s),
      t.center
    ), S = U.equatorialSphericalGeocentricToEquatorialSphericalTopocentric(
      R,
      t.latitude,
      t.elevation,
      g
    );
    return U.equatorialSphericalTopocentricToHorizontalSphericalCoordinates(
      S,
      t.latitude,
      g
    );
  }
  /**
   * @param observerLocation
   * @param otherSolarSystemObject
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
   */
  static getRectangularObjectCentricCoordinatesForSolarSystemObject(t, e, s) {
    return e.getRectangularHeliocentricCoordinates(s).minus(
      t.center.getRectangularHeliocentricCoordinates(
        s
      ),
      t.center
    );
  }
  /**
   * @param observerLocation
   * @param otherSolarSystemObject
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
   */
  static getRectangularEquatorialCoordinatesForSolarSystemObject(t, e, s) {
    const a = this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
      t,
      e,
      s
    ), n = i.degreesToRadians(
      t.center.axialTilt
    );
    return new N(
      a.x,
      a.y * Math.cos(n) - a.z * Math.sin(n),
      a.y * Math.sin(n) + a.z * Math.cos(n)
    );
  }
  static getDistanceToSolarSystemObject(t, e, s) {
    const a = this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
      t,
      e,
      s
    );
    return Math.sqrt(
      Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2)
    );
  }
  static getRADecCoordinatesForSolarSystemObject(t, e, s) {
    const a = this.getRectangularEquatorialCoordinatesForSolarSystemObject(
      t,
      e,
      s
    ), n = a.x > 0 && a.y < 0 ? 360 : a.x < 0 ? 180 : 0, o = i.radiansToDegrees(
      Math.atan(a.y / a.x)
    ) + n, r = i.radiansToDegrees(
      Math.atan(
        a.z / Math.sqrt(
          Math.pow(a.x, 2) + Math.pow(a.y, 2)
        )
      )
    );
    return new P(
      r,
      o,
      this.getDistanceToSolarSystemObject(
        t,
        e,
        s
      )
    );
  }
  static getHADecCoordinatesForSolarSystemObject(t, e, s) {
    const a = this.getRectangularEquatorialCoordinatesForSolarSystemObject(
      t,
      e,
      s
    ), n = a.x > 0 && a.y < 0 ? 360 : a.x < 0 ? 180 : 0, o = i.radiansToDegrees(
      Math.atan(a.y / a.x)
    ) + n, r = i.modDegrees(
      this.getLocalMeanSiderealTime(t, s) - o
    ), c = i.radiansToDegrees(
      Math.atan(
        a.z / Math.sqrt(
          Math.pow(a.x, 2) + Math.pow(a.y, 2)
        )
      )
    );
    return new P(
      c,
      r,
      this.getDistanceToSolarSystemObject(
        t,
        e,
        s
      )
    );
  }
  static getAltAzCoordinatesForEquatorialCoordinates(t, e, s) {
    const a = i.degreesToRadians(
      i.modDegrees(
        e.longitude - this.getLocalMeanSiderealTime(t, s)
      )
    ), n = i.degreesToRadians(t.latitude), o = i.degreesToRadians(
      e.latitude
    ), r = i.radiansToDegrees(
      Math.asin(
        Math.sin(n) * Math.sin(o) + Math.cos(n) * Math.cos(o) * Math.cos(a)
      )
    ), c = i.radiansToDegrees(
      Math.PI - Math.atan2(
        Math.sin(a),
        Math.cos(a) * Math.sin(n) - Math.tan(o) * Math.cos(n)
      )
    );
    return new P(r, c, null);
  }
  static getLocalMeanSiderealTime(t, e) {
    return i.modDegrees(
      t.center.getPrimeMeridianMeanSiderealTime(e) + t.longitude
    );
  }
  static getObjectTransit(t, e, s) {
    const a = this.getRADecCoordinatesForSolarSystemObject(
      t,
      e,
      s
    ).longitude;
    return this.getLocalMeanSiderealTime(t, s) - a;
  }
  static getObjectLowerTransit(t, e, s) {
    const a = this.getRADecCoordinatesForSolarSystemObject(
      t,
      e,
      s
    ).longitude, n = this.getLocalMeanSiderealTime(t, s) - a - 180;
    return i.mod180Degrees(n);
  }
  static getObjectLocalHourAngleForAltitude(t, e, s, a) {
    const n = i.degreesToRadians(
      t.latitude
    ), o = i.degreesToRadians(a), r = i.degreesToRadians(
      this.getRADecCoordinatesForSolarSystemObject(
        t,
        e,
        s
      ).latitude
    ), c = (Math.sin(o) - Math.sin(n) * Math.sin(r)) / (Math.cos(n) * Math.cos(r));
    return i.radiansToDegrees(Math.acos(c));
  }
  static getIterationValueForPositionalEphemerisForObject(t, e, s, a) {
    if (a === E.EPHEMERIS_TYPE.TRANSIT)
      return s - this.getObjectTransit(t, e, s) / 15 / 24;
    if (a === E.EPHEMERIS_TYPE.LOWER_TRANSIT)
      return s - this.getObjectLowerTransit(
        t,
        e,
        s
      ) / 15 / 24;
    {
      const n = this.getObjectTransit(
        t,
        e,
        s
      ), o = this.getObjectLocalHourAngleForAltitude(
        t,
        e,
        s,
        a.ALTITUDE
      ), r = i.mod180Degrees(
        a.IS_GOING_UP ? n + o : n - o
      );
      return s - r / 15 / 24;
    }
  }
  static iteratePositionalEphemerisForObject(t, e, s, a) {
    let n = this.getIterationValueForPositionalEphemerisForObject(
      t,
      e,
      s,
      a
    ), o = +n;
    for (let r = 0; r < 1e3 && !isNaN(n) && (n = this.getIterationValueForPositionalEphemerisForObject(
      t,
      e,
      n,
      a
    ), !(Math.abs(n - o) < 1e-5)); r++)
      o = n;
    return A.julianDateToDate(n);
  }
  static getCorrectDateForPositionalEphemeris(t, e, s, a, n) {
    const o = this.iteratePositionalEphemerisForObject(
      t,
      e,
      s,
      a
    );
    if (n > 0 && o.getDate() !== A.julianDateToDate(s).getDate()) {
      const r = A.julianDate(o), c = r > s ? -1 : 1;
      return this.getCorrectDateForPositionalEphemeris(
        t,
        e,
        r + c,
        a,
        n - 1
      );
    } else return n === 0 ? null : o;
  }
  static getDateForPositionalEphemeris(t, e, s, a) {
    return this.getCorrectDateForPositionalEphemeris(
      t,
      e,
      s,
      a,
      E.NUMBERS_OF_ATTEMPT_TO_GET_POSITIONAL_EPHEMERIS
    );
  }
}
class tt extends M {
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
class et extends M {
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
class st extends M {
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
class at extends M {
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
class nt extends M {
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
class it extends M {
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
class ot extends M {
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
const rt = [
  new tt(),
  new et(),
  new B(),
  new st(),
  new at(),
  new nt(),
  new it(),
  new ot()
];
class ct extends M {
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
const lt = [new ct()];
class ht extends M {
  constructor() {
    super(I.SATELLITE, "Moon", null, 1737400, 1.5424);
  }
  getRectangularHeliocentricCoordinates(t) {
    const e = A.julianCenturiesSinceEpoch2000(t), s = e * e, a = s * e, n = a * e, o = 218.3164477 + 481267.88123421 * e - 15786e-7 * s + a / 538841 - n / 65194e3, r = 297.8501921 + 445267.1114034 * e - 18819e-7 * s + a / 545868 - n / 113065e3, c = 357.5291092 + 35999.0502909 * e - 1536e-7 * s + a / 2449e4, d = 134.9633964 + 477198.8675055 * e + 87414e-7 * s + a / 69699 - n / 14712e3, u = 93.272095 + 483202.0175233 * e - 36539e-7 * s - a / 3526e3 + n / 86331e4, T = 119.75 + 131.849 * e, g = 53.09 + 479264.29 * e, R = 313.45 + 481266.484 * e, S = 1 - 2516e-6 * e - 74e-7 * s, l = (O) => O * Math.PI / 180, y = [
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
    ], H = [
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
    let w = 0;
    for (const [O, D, b, L, C, j] of y) {
      const z = O * l(r) + D * l(c) + b * l(d) + L * l(u);
      w += C * Math.pow(S, Math.abs(D)) * Math.sin(z);
    }
    let J = 0;
    for (const [O, D, b, L, C, j] of y) {
      const z = O * l(r) + D * l(c) + b * l(d) + L * l(u);
      J += j * Math.pow(S, Math.abs(D)) * Math.cos(z);
    }
    let p = 0;
    for (const [O, D, b, L, C] of H) {
      const j = O * l(r) + D * l(c) + b * l(d) + L * l(u);
      p += C * Math.pow(S, Math.abs(D)) * Math.sin(j);
    }
    w = w + 3958 * Math.sin(l(T)) + 1962 * Math.sin(l(o - u)) + 318 * Math.sin(l(g)), p = p - 2235 * Math.sin(l(o)) + 382 * Math.sin(l(R)) + 175 * Math.sin(l(T - u)) + 175 * Math.sin(l(T + u)) + 127 * Math.sin(l(o - d)) - 115 * Math.sin(l(o + d));
    let k = o + w / 1e6, W = p / 1e6, Z = 385000.56 + J / 1e3, Y = l(k), G = l(W), F = Z / 1495978707e-1;
    const x = {
      x: F * Math.cos(G) * Math.cos(Y),
      y: F * Math.cos(G) * Math.sin(Y),
      z: F * Math.sin(G)
    }, f = new B().getRectangularHeliocentricCoordinates(t);
    return new N(
      f.x + x.x,
      f.y + x.y,
      f.z + x.z
    );
  }
}
const dt = [new ht()];
class ut extends M {
  constructor() {
    super(I.STAR, "Sun", null, 695508e3, 0);
  }
  getRectangularHeliocentricCoordinates(t) {
    return new N(0, 0, 0, this);
  }
}
const Tt = [new ut()].concat(rt).concat(dt).concat(lt);
class q {
  constructor() {
    this.skyObjects = [...Tt], this.astronomicalCalculator = new _(), this.observerLocation = null, this.julianDate = null, this.date = null;
  }
  getJulianDate() {
    return this.julianDate;
  }
  setJulianDate(t) {
    this.julianDate = t;
  }
  getDate() {
    return this.date;
  }
  setDate(t) {
    this.date = t, this.setJulianDate(A.julianDate(t));
  }
  getSkyObjectByName(t) {
    return this.skyObjects.find((e) => e.name === t) || null;
  }
  getEphemerisTypeByName(t) {
    return Object.values(E.EPHEMERIS_TYPE).find(
      (e) => e.NAME === t
    ) || null;
  }
  setLocation(t, e, s, a) {
    const n = this.getSkyObjectByName(t);
    if (!n)
      throw new Error(`Solar system object "${t}" not found`);
    this.observerLocation = new V(
      s,
      e,
      a,
      n
    );
  }
  getLatitudeLongitudeCoordinates() {
    return {
      latitude: this.observerLocation.latitude,
      longitude: this.observerLocation.longitude
    };
  }
  getRADecCoordinatesForObject(t) {
    const e = this.getSkyObjectByName(t);
    if (!e || this.julianDate === null)
      throw new Error("Invalid object name or Julian date not set");
    return _.getRADecCoordinatesForSolarSystemObject(
      this.observerLocation,
      e,
      this.julianDate
    );
  }
  getHADecCoordinatesForObject(t) {
    const e = this.getSkyObjectByName(t);
    if (!e || this.julianDate === null)
      throw new Error("Invalid object name or Julian date not set");
    return _.getHADecCoordinatesForSolarSystemObject(
      this.observerLocation,
      e,
      this.julianDate
    );
  }
  getLocalMeanSiderealTime() {
    if (this.julianDate === null)
      throw new Error("Julian date not set");
    return _.getLocalMeanSiderealTime(
      this.observerLocation,
      this.julianDate
    );
  }
  getAltAzCoordinatesForObject(t, e) {
    const s = this.getSkyObjectByName(t);
    if (!s)
      throw new Error(`Object "${t}" not found`);
    const a = e ? A.julianDate(e) : this.julianDate;
    if (a === null)
      throw new Error("Reference date not set");
    const n = _.getRADecCoordinatesForSolarSystemObject(
      this.observerLocation,
      s,
      a
    );
    return _.getAltAzCoordinatesForEquatorialCoordinates(
      this.observerLocation,
      n,
      a
    );
  }
  static initialize(t, e) {
    let s = new q();
    return s.setLocation("Earth", t, e, 0), s.setDate(/* @__PURE__ */ new Date()), s;
  }
  getEphemerisDateForObject(t, e, s) {
    const a = this.getSkyObjectByName(t), n = this.getEphemerisTypeByName(s);
    if (!a || !n)
      throw new Error("Invalid object name or ephemeris type");
    return _.getDateForPositionalEphemeris(
      this.observerLocation,
      a,
      A.julianDate(e),
      n
    );
  }
}
function gt(h, t) {
  return q.initialize(h, t);
}
export {
  q as AstronomyJS,
  gt as initialize
};
