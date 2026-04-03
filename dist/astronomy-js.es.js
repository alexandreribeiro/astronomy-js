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
const g = {
  GREENWICH_OBSERVATORY_COORDINATES: {
    LATITUDE: 51.476852,
    LONGITUDE: -5e-4,
    RADIUS: 6371046
  },
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
    return t / g.MS_PER_DAY + g.JULIAN_DAY_OFFSET;
  }
  static julianDateToDate(t) {
    return new Date(
      (t - g.JULIAN_DAY_OFFSET) * g.MS_PER_DAY
    );
  }
  static julianDaysSinceEpoch2000(t) {
    return t - g.JULIAN_DAY_2000;
  }
  static julianCenturiesSinceEpoch2000(t) {
    return this.julianDaysSinceEpoch2000(t) / g.DAYS_PER_JULIAN_CENTURY;
  }
}
class n {
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
class v {
  constructor(t, e, s, a) {
    this.longitude = t, this.latitude = e, this.elevation = s, this.center = a;
  }
}
class L {
  constructor(t, e, s) {
    this.latitude = t, this.longitude = e, this.radius = s;
  }
  toDegrees() {
    let t = this.latitude, e = this.longitude;
    return new L(
      `${t < 0 ? "-" : ""}${n.padZero(0 | (t < 0 ? t = -t : t))}° ${n.padZero(0 | t % 1 * 60)}' ${n.padZero(0 | t * 60 % 1 * 60)}''`,
      `${e < 0 ? "-" : ""}${n.padZero(0 | (e < 0 ? e = -e : e))}° ${n.padZero(0 | e % 1 * 60)}' ${n.padZero(0 | e * 60 % 1 * 60)}''`,
      this.radius
    );
  }
  toHours() {
    let t = this.latitude, e = this.longitude;
    return new L(
      `${t < 0 ? "-" : ""}${n.padZero(0 | (t < 0 ? t = -t : t))}° ${n.padZero(0 | t % 1 * 60)}' ${n.padZero(0 | t * 60 % 1 * 60)}''`,
      `${e < 0 ? "-" : ""}${n.padZero(0 | (e < 0 ? e = -e / 15 : e = e / 15))}h ${n.padZero(0 | e % 1 * 60)}m ${n.padZero(0 | e * 60 % 1 * 60)}s`,
      this.radius
    );
  }
}
class _ {
  constructor(t, e, s, a) {
    this.x = t, this.y = e, this.z = s, this.center = a;
  }
  /**
   * @param {EclipticRectangularCoordinates} eclipticRectangularCoordinates
   * @param {SolarSystemObject} center
   * @returns {EclipticRectangularCoordinates}
   */
  minus(t, e) {
    return new _(
      this.x - t.x,
      this.y - t.y,
      this.z - t.z,
      e
    );
  }
}
class Z {
  constructor(t, e, s, a) {
    this.lambda = t, this.beta = e, this.delta = s, this.center = a;
  }
}
class J {
  constructor(t, e, s, a, o) {
    this.rightAscension = t, this.declination = e, this.delta = s, this.obliquity = a, this.center = o;
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
class j {
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
    ) * (180 / Math.PI), a = Math.asin(t.z / e) * (180 / Math.PI), o = (s + 360) % 360;
    return new Z(
      o,
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
    const s = n.degreesToRadians(
      t.lambda
    ), a = n.degreesToRadians(
      t.beta
    ), o = n.degreesToRadians(e), i = Math.sin(a) * Math.cos(o) + Math.cos(a) * Math.sin(o) * Math.sin(s), r = Math.sin(s) * Math.cos(o) - Math.tan(a) * Math.sin(o), h = Math.cos(s), d = Math.atan2(r, h), u = n.modDegrees(
      n.radiansToDegrees(d)
    ), T = n.radiansToDegrees(Math.asin(i));
    return new J(
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
    const o = t.center.meanRadius, i = n.degreesToRadians(
      t.rightAscension
    ), r = n.degreesToRadians(
      t.declination
    ), h = n.degreesToRadians(e), d = n.degreesToRadians(
      a
    ), u = Math.atan(
      (1 - t.center.flattening) * Math.tan(h)
    ), T = (1 - t.center.flattening) * Math.sin(u) + s / o * Math.sin(h), M = Math.cos(u) + s / o * Math.cos(h), S = Math.asin(
      t.center.meanRadius / g.METERS_PER_AU / t.delta
    ), R = d - i, c = Math.atan2(
      -M * Math.sin(S) * Math.sin(R),
      Math.cos(r) - M * Math.sin(S) * Math.cos(R)
    ), b = n.modDegrees(
      n.radiansToDegrees(
        i + c
      )
    ), U = n.radiansToDegrees(
      Math.atan2(
        (Math.sin(r) - T * Math.sin(S)) * Math.cos(c),
        Math.cos(r) - M * Math.sin(S) * Math.cos(R)
      )
    );
    return new X(
      b,
      U
    );
  }
  /**
   * @param {TopocentricEquatorialSphericalCoordinates} equatorialSphericalTopocentricCoordinates
   * @param {number} observerLatitude - geographic latitude of the observer in degrees
   * @param localMeanSiderealTime
   * @returns {HorizontalSphericalCoordinates}
   */
  static equatorialSphericalTopocentricToHorizontalSphericalCoordinates(t, e, s) {
    const a = n.degreesToRadians(
      t.rightAscension
    ), o = n.degreesToRadians(
      t.declination
    ), i = n.degreesToRadians(e), h = n.degreesToRadians(
      s
    ) - a, d = Math.asin(
      Math.sin(i) * Math.sin(o) + Math.cos(i) * Math.cos(o) * Math.cos(h)
    ), u = Math.atan2(
      Math.sin(h),
      Math.cos(h) * Math.sin(i) - Math.tan(o) * Math.cos(i)
    ), T = n.radiansToDegrees(d), M = n.modDegrees(
      n.radiansToDegrees(u) + 180
    );
    return new K(M, T);
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
  constructor(t, e, s, a, o, i, r, h, d, u, T, M) {
    this.a0 = t, this.e0 = e, this.i0 = s, this.o0 = a, this.w0 = o, this.l0 = i, this.ac = r, this.ec = h, this.ic = d, this.oc = u, this.wc = T, this.lc = M;
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
    return n.modDegrees(
      this.i0 + this.ic / 3600 * t
    );
  }
  getAscendingNode(t) {
    return n.modDegrees(
      this.o0 + this.oc / 3600 * t
    );
  }
  getPerihelion(t) {
    return n.modDegrees(
      this.w0 + this.wc / 3600 * t
    );
  }
  getMeanLongitude(t) {
    return n.modDegrees(
      this.l0 + this.lc / 3600 * t
    );
  }
  getMeanAnomaly(t) {
    return n.modDegrees(
      this.getMeanLongitude(t) - this.getPerihelion(t)
    );
  }
  /**
   *
   * @param julianCenturiesSinceEpoch2000
   * @returns {*} E: eccentric anomaly
   */
  getEccentricAnomaly(t) {
    const e = n.degreesToRadians(
      this.getMeanAnomaly(t)
    ), s = this.getEccentricity(t);
    let a = e + s * Math.sin(e) * (1 + s * Math.cos(e)), o = 0, i = 0, r = 0;
    for (; r++ < 1e4 && (o = a - (a - s * Math.sin(a) - e) / (1 - s * Math.cos(a)), i = o - a, a = o, !(Math.abs(i) <= g.EPS)); )
      ;
    return n.radiansToDegrees(o);
  }
  /**
   * @param julianCenturiesSinceEpoch2000
   * @returns V: true anomaly
   */
  getTrueAnomaly(t) {
    const e = this.getEccentricity(t), s = n.degreesToRadians(
      this.getEccentricAnomaly(t)
    ), a = 2 * Math.atan(
      Math.sqrt((1 + e) / (1 - e)) * Math.tan(0.5 * s)
    );
    return n.radiansToDegrees(a);
  }
  /**
   * R = (a * (1 - e^2)) / (1 + e * cos(V))
   * @param julianCenturiesSinceEpoch2000
   * @returns R: orbit radius
   */
  getOrbitRadius(t) {
    const e = this.getSemiMajorAxis(t), s = this.getEccentricity(t), a = this.getTrueAnomaly(t);
    return e * (1 - Math.pow(s, 2)) / (1 + s * Math.cos(n.degreesToRadians(a)));
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
class E extends Q {
  constructor(t, e, s, a, o, i) {
    super(t, e), this.orbitalParameters = s, this.meanRadius = a, this.axialTilt = o, this.flattening = i;
  }
  /**
   * @param orbitalParameters
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
   */
  static getRectangularHeliocentricCoordinatesFromOrbitalParameters(t, e) {
    const s = A.julianCenturiesSinceEpoch2000(e), a = n.degreesToRadians(
      t.getInclination(s)
    ), o = n.degreesToRadians(
      t.getTrueAnomaly(s)
    ), i = n.degreesToRadians(
      t.getPerihelion(s)
    ), r = n.degreesToRadians(
      t.getAscendingNode(s)
    ), h = t.getOrbitRadius(s), d = o + i - r, u = h * (Math.cos(r) * Math.cos(d) - Math.sin(r) * Math.sin(d) * Math.cos(a)), T = h * (Math.sin(r) * Math.cos(d) + Math.cos(r) * Math.sin(d) * Math.cos(a)), M = h * (Math.sin(d) * Math.sin(a));
    return new _(u, T, M, null);
  }
  /**
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
   */
  getRectangularHeliocentricCoordinates(t) {
    return E.getRectangularHeliocentricCoordinatesFromOrbitalParameters(
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
class z extends E {
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
    return n.modDegrees(a);
  }
}
class W {
  constructor(t, e) {
    this.observerLocation = t || new v(
      g.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
      g.GREENWICH_OBSERVATORY_COORDINATES.LONGITUDE,
      g.GREENWICH_OBSERVATORY_COORDINATES.RADIUS,
      new z()
    ), this.solarSystemObject = e;
  }
  getHorizontalSphericalCoordinatesForSolarSystemObject(t, e, s) {
    const a = this.observerLocation.center.getRectangularHeliocentricCoordinates(
      s
    ), o = e.getRectangularHeliocentricCoordinates(s), i = o.minus(
      a,
      o.center
    ), r = j.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
      i
    ), h = j.eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(
      r,
      this.observerLocation.center.getObliquity(s)
    ), d = h.rightAscension, u = h.declination, T = h.delta, M = this.getLocalMeanSiderealTime(s), S = this.observerLocation.latitude, R = this.observerLocation.elevation, c = new J(
      d,
      u,
      T,
      this.observerLocation.center.getObliquity(s),
      this.observerLocation.center
    ), b = j.equatorialSphericalGeocentricToEquatorialSphericalTopocentric(
      c,
      S,
      R,
      M
    );
    return j.equatorialSphericalTopocentricToHorizontalSphericalCoordinates(
      b,
      S,
      M
    );
  }
  /**
   * @param otherSolarSystemObject
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
   */
  getRectangularObjectCentricCoordinatesForSolarSystemObject(t, e) {
    return t.getRectangularHeliocentricCoordinates(e).minus(
      this.solarSystemObject.getRectangularHeliocentricCoordinates(
        e
      ),
      this.observerLocation.center
    );
  }
  /**
   * @param otherSolarSystemObject
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
   */
  getRectangularEquatorialCoordinatesForSolarSystemObject(t, e) {
    const s = this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
      t,
      e
    ), a = n.degreesToRadians(
      this.solarSystemObject.axialTilt
    );
    return new _(
      s.x,
      s.y * Math.cos(a) - s.z * Math.sin(a),
      s.y * Math.sin(a) + s.z * Math.cos(a)
    );
  }
  getDistanceToSolarSystemObject(t, e) {
    const s = this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
      t,
      e
    );
    return Math.sqrt(
      Math.pow(s.x, 2) + Math.pow(s.y, 2) + Math.pow(s.z, 2)
    );
  }
  getRADecCoordinatesForSolarSystemObject(t, e) {
    const s = this.getRectangularEquatorialCoordinatesForSolarSystemObject(
      t,
      e
    ), a = s.x > 0 && s.y < 0 ? 360 : s.x < 0 ? 180 : 0, o = n.radiansToDegrees(
      Math.atan(s.y / s.x)
    ) + a, i = n.radiansToDegrees(
      Math.atan(
        s.z / Math.sqrt(
          Math.pow(s.x, 2) + Math.pow(s.y, 2)
        )
      )
    );
    return new L(
      i,
      o,
      this.getDistanceToSolarSystemObject(t, e)
    );
  }
  getHADecCoordinatesForSolarSystemObject(t, e) {
    const s = this.getRectangularEquatorialCoordinatesForSolarSystemObject(
      t,
      e
    ), a = s.x > 0 && s.y < 0 ? 360 : s.x < 0 ? 180 : 0, o = n.radiansToDegrees(
      Math.atan(s.y / s.x)
    ) + a, i = n.modDegrees(
      this.getLocalMeanSiderealTime(e) - o
    ), r = n.radiansToDegrees(
      Math.atan(
        s.z / Math.sqrt(
          Math.pow(s.x, 2) + Math.pow(s.y, 2)
        )
      )
    );
    return new L(
      r,
      i,
      this.getDistanceToSolarSystemObject(t, e)
    );
  }
  getAltAzCoordinatesForEquatorialCoordinates(t, e) {
    const s = n.degreesToRadians(
      n.modDegrees(
        t.longitude - this.getLocalMeanSiderealTime(e)
      )
    ), a = n.degreesToRadians(
      this.observerLocation.latitude
    ), o = n.degreesToRadians(
      t.latitude
    ), i = n.radiansToDegrees(
      Math.asin(
        Math.sin(a) * Math.sin(o) + Math.cos(a) * Math.cos(o) * Math.cos(s)
      )
    ), r = n.radiansToDegrees(
      Math.PI - Math.atan2(
        Math.sin(s),
        Math.cos(s) * Math.sin(a) - Math.tan(o) * Math.cos(a)
      )
    );
    return new L(i, r, null);
  }
  getLocalMeanSiderealTime(t) {
    return n.modDegrees(
      this.observerLocation.center.getPrimeMeridianMeanSiderealTime(
        t
      ) + this.observerLocation.longitude
    );
  }
  getObjectTransit(t, e) {
    const s = this.getRADecCoordinatesForSolarSystemObject(
      t,
      e
    ).longitude;
    return this.getLocalMeanSiderealTime(e) - s;
  }
  getObjectLowerTransit(t, e) {
    const s = this.getRADecCoordinatesForSolarSystemObject(
      t,
      e
    ).longitude, a = this.getLocalMeanSiderealTime(e) - s - 180;
    return n.mod180Degrees(a);
  }
  getObjectLocalHourAngleForAltitude(t, e, s) {
    const a = n.degreesToRadians(
      this.observerLocation.latitude
    ), o = n.degreesToRadians(s), i = n.degreesToRadians(
      this.getRADecCoordinatesForSolarSystemObject(
        t,
        e
      ).latitude
    ), r = (Math.sin(o) - Math.sin(a) * Math.sin(i)) / (Math.cos(a) * Math.cos(i));
    return n.radiansToDegrees(Math.acos(r));
  }
  getIterationValueForPositionalEphemerisForObject(t, e, s) {
    if (s === g.EPHEMERIS_TYPE.TRANSIT)
      return e - this.getObjectTransit(t, e) / 15 / 24;
    if (s === g.EPHEMERIS_TYPE.LOWER_TRANSIT)
      return e - this.getObjectLowerTransit(t, e) / 15 / 24;
    {
      const a = this.getObjectTransit(
        t,
        e
      ), o = this.getObjectLocalHourAngleForAltitude(
        t,
        e,
        s.ALTITUDE
      ), i = n.mod180Degrees(
        s.IS_GOING_UP ? a + o : a - o
      );
      return e - i / 15 / 24;
    }
  }
  iteratePositionalEphemerisForObject(t, e, s) {
    let a = this.getIterationValueForPositionalEphemerisForObject(
      t,
      e,
      s
    ), o = +a;
    for (let i = 0; i < 1e3 && !isNaN(a) && (a = this.getIterationValueForPositionalEphemerisForObject(
      t,
      a,
      s
    ), !(Math.abs(a - o) < 1e-5)); i++)
      o = a;
    return A.julianDateToDate(a);
  }
  getCorrectDateForPositionalEphemeris(t, e, s, a) {
    const o = this.iteratePositionalEphemerisForObject(
      t,
      e,
      s
    );
    if (a > 0 && o.getDate() !== A.julianDateToDate(e).getDate()) {
      const i = A.julianDate(o), r = i > e ? -1 : 1;
      return this.getCorrectDateForPositionalEphemeris(
        t,
        i + r,
        s,
        a - 1
      );
    } else return a === 0 ? null : o;
  }
  getDateForPositionalEphemeris(t, e, s) {
    return this.getCorrectDateForPositionalEphemeris(
      t,
      e,
      s,
      g.NUMBERS_OF_ATTEMPT_TO_GET_POSITIONAL_EPHEMERIS
    );
  }
}
class tt extends E {
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
class et extends E {
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
class st extends E {
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
class at extends E {
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
class nt extends E {
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
class ot extends E {
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
class it extends E {
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
  new z(),
  new st(),
  new at(),
  new nt(),
  new ot(),
  new it()
];
class ct extends E {
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
class ht extends E {
  constructor() {
    super(I.SATELLITE, "Moon", null, 1737400, 1.5424);
  }
  getRectangularHeliocentricCoordinates(t) {
    const e = A.julianCenturiesSinceEpoch2000(t), s = e * e, a = s * e, o = a * e, i = 218.3164477 + 481267.88123421 * e - 15786e-7 * s + a / 538841 - o / 65194e3, r = 297.8501921 + 445267.1114034 * e - 18819e-7 * s + a / 545868 - o / 113065e3, h = 357.5291092 + 35999.0502909 * e - 1536e-7 * s + a / 2449e4, d = 134.9633964 + 477198.8675055 * e + 87414e-7 * s + a / 69699 - o / 14712e3, u = 93.272095 + 483202.0175233 * e - 36539e-7 * s - a / 3526e3 + o / 86331e4, T = 119.75 + 131.849 * e, M = 53.09 + 479264.29 * e, S = 313.45 + 481266.484 * e, R = 1 - 2516e-6 * e - 74e-7 * s, c = (D) => D * Math.PI / 180, b = [
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
    ], U = [
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
    for (const [D, O, N, P, w, p] of b) {
      const f = D * c(r) + O * c(h) + N * c(d) + P * c(u);
      y += w * Math.pow(R, Math.abs(O)) * Math.sin(f);
    }
    let Y = 0;
    for (const [D, O, N, P, w, p] of b) {
      const f = D * c(r) + O * c(h) + N * c(d) + P * c(u);
      Y += p * Math.pow(R, Math.abs(O)) * Math.cos(f);
    }
    let C = 0;
    for (const [D, O, N, P, w] of U) {
      const p = D * c(r) + O * c(h) + N * c(d) + P * c(u);
      C += w * Math.pow(R, Math.abs(O)) * Math.sin(p);
    }
    y = y + 3958 * Math.sin(c(T)) + 1962 * Math.sin(c(i - u)) + 318 * Math.sin(c(M)), C = C - 2235 * Math.sin(c(i)) + 382 * Math.sin(c(S)) + 175 * Math.sin(c(T - u)) + 175 * Math.sin(c(T + u)) + 127 * Math.sin(c(i - d)) - 115 * Math.sin(c(i + d));
    let $ = i + y / 1e6, k = C / 1e6, V = 385000.56 + Y / 1e3, B = c($), H = c(k), G = V / 1495978707e-1;
    const F = {
      x: G * Math.cos(H) * Math.cos(B),
      y: G * Math.cos(H) * Math.sin(B),
      z: G * Math.sin(H)
    }, x = new z().getRectangularHeliocentricCoordinates(t);
    return new _(
      x.x + F.x,
      x.y + F.y,
      x.z + F.z
    );
  }
}
const dt = [new ht()];
class ut extends E {
  constructor() {
    super(I.STAR, "Sun", null, 695508e3, 0);
  }
  getRectangularHeliocentricCoordinates(t) {
    return new _(0, 0, 0, this);
  }
}
const Tt = [new ut()].concat(rt).concat(dt).concat(lt);
class q {
  constructor() {
    this.skyObjects = [...Tt], this.astronomicalCalculator = new W(), this.observerLocation = null, this.julianDate = null, this.date = null;
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
    return Object.values(g.EPHEMERIS_TYPE).find(
      (e) => e.NAME === t
    ) || null;
  }
  setLocation(t, e, s, a) {
    const o = this.getSkyObjectByName(t);
    if (!o)
      throw new Error(`Solar system object "${t}" not found`);
    this.observerLocation = new v(
      s,
      e,
      a,
      o
    ), this.astronomicalCalculator = new W(
      new v(
        s,
        e,
        o.meanRadius + a,
        o
      ),
      o
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
    return this.astronomicalCalculator.getRADecCoordinatesForSolarSystemObject(
      e,
      this.julianDate
    );
  }
  getHADecCoordinatesForObject(t) {
    const e = this.getSkyObjectByName(t);
    if (!e || this.julianDate === null)
      throw new Error("Invalid object name or Julian date not set");
    return this.astronomicalCalculator.getHADecCoordinatesForSolarSystemObject(
      e,
      this.julianDate
    );
  }
  getLocalMeanSiderealTime() {
    if (this.julianDate === null)
      throw new Error("Julian date not set");
    return this.astronomicalCalculator.getLocalMeanSiderealTime(
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
    const o = this.astronomicalCalculator.getRADecCoordinatesForSolarSystemObject(
      s,
      a
    );
    return this.astronomicalCalculator.getAltAzCoordinatesForEquatorialCoordinates(
      o,
      a
    );
  }
  static initialize(t, e) {
    let s = new q();
    return s.setLocation("Earth", t, e, 0), s.setDate(/* @__PURE__ */ new Date()), s;
  }
  getEphemerisDateForObject(t, e, s) {
    const a = this.getSkyObjectByName(t), o = this.getEphemerisTypeByName(s);
    if (!a || !o)
      throw new Error("Invalid object name or ephemeris type");
    return this.astronomicalCalculator.getDateForPositionalEphemeris(
      a,
      A.julianDate(e),
      o
    );
  }
}
function gt(l, t) {
  return q.initialize(l, t);
}
export {
  q as AstronomyJS,
  gt as initialize
};
