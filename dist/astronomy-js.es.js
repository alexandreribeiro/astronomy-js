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
const l = {
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
  DAYS_PER_JULIAN_CENTURY: 36525
};
class r {
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
class d {
  static julianDate(t) {
    return t / l.MS_PER_DAY + l.JULIAN_DAY_OFFSET;
  }
  static julianDateToDate(t) {
    return new Date(
      (t - l.JULIAN_DAY_OFFSET) * l.MS_PER_DAY
    );
  }
  static julianDaysSinceEpoch2000(t) {
    return t - l.JULIAN_DAY_2000;
  }
  static julianCenturiesSinceEpoch2000(t) {
    return this.julianDaysSinceEpoch2000(t) / l.DAYS_PER_JULIAN_CENTURY;
  }
  static meanSiderealTime(t) {
    const e = this.julianDaysSinceEpoch2000(t), s = this.julianCenturiesSinceEpoch2000(t), a = 280.46061837 + 360.98564736629 * e + 387933e-9 * s * s - s * s * s / 3871e4;
    return r.modDegrees(a);
  }
}
class g {
  constructor(t, e, s, a) {
    this.x = t, this.y = e, this.z = s, this.center = a;
  }
  /**
   * @param {EclipticRectangularCoordinates} eclipticRectangularCoordinates
   * @param {SkyObject} center
   * @returns {EclipticRectangularCoordinates}
   */
  minus(t, e) {
    return new g(
      this.x - t.x,
      this.y - t.y,
      this.z - t.z,
      e
    );
  }
}
class A {
  constructor(t, e, s) {
    this.latitude = t, this.longitude = e, this.radius = s;
  }
  toDegrees() {
    let t = this.latitude, e = this.longitude;
    return new A(
      `${t < 0 ? "-" : ""}${r.padZero(0 | (t < 0 ? t = -t : t))}° ${r.padZero(0 | t % 1 * 60)}' ${r.padZero(0 | t * 60 % 1 * 60)}''`,
      `${e < 0 ? "-" : ""}${r.padZero(0 | (e < 0 ? e = -e : e))}° ${r.padZero(0 | e % 1 * 60)}' ${r.padZero(0 | e * 60 % 1 * 60)}''`,
      this.radius
    );
  }
  toHours() {
    let t = this.latitude, e = this.longitude;
    return new A(
      `${t < 0 ? "-" : ""}${r.padZero(0 | (t < 0 ? t = -t : t))}° ${r.padZero(0 | t % 1 * 60)}' ${r.padZero(0 | t * 60 % 1 * 60)}''`,
      `${e < 0 ? "-" : ""}${r.padZero(0 | (e < 0 ? e = -e / 15 : e = e / 15))}h ${r.padZero(0 | e % 1 * 60)}m ${r.padZero(0 | e * 60 % 1 * 60)}s`,
      this.radius
    );
  }
}
class N {
  constructor(t, e, s, a) {
    this.longitude = t, this.latitude = e, this.radius = s, this.center = a;
  }
}
class _ {
  constructor(t, e) {
    this.skyObjectType = t, this.name = e;
  }
}
const h = {
  PLANET: "planet",
  STAR: "star"
};
class R {
  constructor(t, e) {
    this.observerSphericalCoordinates = t || new N(
      l.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
      l.GREENWICH_OBSERVATORY_COORDINATES.LONGITUDE,
      l.GREENWICH_OBSERVATORY_COORDINATES.RADIUS,
      new _(h.PLANET, "Earth")
    ), this.solarSystemObject = e;
  }
  getRectangularObjectCentricCoordinatesForSolarSystemObject(t, e) {
    return t.getRectangularHeliocentricCoordinates(e).minus(
      this.solarSystemObject.getRectangularHeliocentricCoordinates(
        e
      ),
      this.observerSphericalCoordinates.center
    );
  }
  getRectangularEquatorialCoordinatesForSolarSystemObject(t, e) {
    const s = this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
      t,
      e
    ), a = r.degreesToRadians(
      this.solarSystemObject.axialTilt
    );
    return new g(
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
    ), a = s.x > 0 && s.y < 0 ? 360 : s.x < 0 ? 180 : 0, o = r.radiansToDegrees(
      Math.atan(s.y / s.x)
    ) + a, n = r.radiansToDegrees(
      Math.atan(
        s.z / Math.sqrt(
          Math.pow(s.x, 2) + Math.pow(s.y, 2)
        )
      )
    );
    return new A(
      n,
      o,
      this.getDistanceToSolarSystemObject(t, e)
    );
  }
  getHADecCoordinatesForSolarSystemObject(t, e) {
    const s = this.getRectangularEquatorialCoordinatesForSolarSystemObject(
      t,
      e
    ), a = s.x > 0 && s.y < 0 ? 360 : s.x < 0 ? 180 : 0, o = r.radiansToDegrees(
      Math.atan(s.y / s.x)
    ) + a, n = r.modDegrees(
      this.getLocalSiderealTime(e) - o
    ), c = r.radiansToDegrees(
      Math.atan(
        s.z / Math.sqrt(
          Math.pow(s.x, 2) + Math.pow(s.y, 2)
        )
      )
    );
    return new A(
      c,
      n,
      this.getDistanceToSolarSystemObject(t, e)
    );
  }
  getAltAzCoordinatesForEquatorialCoordinates(t, e) {
    const s = r.degreesToRadians(
      r.modDegrees(
        t.longitude - this.getLocalSiderealTime(e)
      )
    ), a = r.degreesToRadians(
      this.observerSphericalCoordinates.latitude
    ), o = r.degreesToRadians(
      t.latitude
    ), n = r.radiansToDegrees(
      Math.asin(
        Math.sin(a) * Math.sin(o) + Math.cos(a) * Math.cos(o) * Math.cos(s)
      )
    ), c = r.radiansToDegrees(
      Math.PI - Math.atan2(
        Math.sin(s),
        Math.cos(s) * Math.sin(a) - Math.tan(o) * Math.cos(a)
      )
    );
    return new A(n, c, null);
  }
  getLocalSiderealTime(t) {
    return r.modDegrees(
      d.meanSiderealTime(t) + this.observerSphericalCoordinates.longitude
    );
  }
  getObjectTransit(t, e) {
    const s = this.getRADecCoordinatesForSolarSystemObject(
      t,
      e
    ).longitude;
    return this.getLocalSiderealTime(e) - s;
  }
  getObjectLowerTransit(t, e) {
    const s = this.getRADecCoordinatesForSolarSystemObject(
      t,
      e
    ).longitude, a = this.getLocalSiderealTime(e) - s - 180;
    return r.mod180Degrees(a);
  }
  getObjectLocalHourAngleForAltitude(t, e, s) {
    const a = r.degreesToRadians(
      this.observerSphericalCoordinates.latitude
    ), o = r.degreesToRadians(s), n = r.degreesToRadians(
      this.getRADecCoordinatesForSolarSystemObject(
        t,
        e
      ).latitude
    ), c = (Math.sin(o) - Math.sin(a) * Math.sin(n)) / (Math.cos(a) * Math.cos(n));
    return r.radiansToDegrees(Math.acos(c));
  }
  getIterationValueForPositionalEphemerisForObject(t, e, s) {
    if (s === l.EPHEMERIS_TYPE.TRANSIT)
      return e - this.getObjectTransit(t, e) / 15 / 24;
    if (s === l.EPHEMERIS_TYPE.LOWER_TRANSIT)
      return e - this.getObjectLowerTransit(t, e) / 15 / 24;
    {
      const a = this.getObjectTransit(
        t,
        e
      ), o = this.getObjectLocalHourAngleForAltitude(
        t,
        e,
        s.ALTITUDE
      ), n = r.mod180Degrees(
        s.IS_GOING_UP ? a + o : a - o
      );
      return e - n / 15 / 24;
    }
  }
  iteratePositionalEphemerisForObject(t, e, s) {
    let a = this.getIterationValueForPositionalEphemerisForObject(
      t,
      e,
      s
    ), o = +a;
    for (let n = 0; n < 1e3 && !isNaN(a) && (a = this.getIterationValueForPositionalEphemerisForObject(
      t,
      a,
      s
    ), !(Math.abs(a - o) < 1e-5)); n++)
      o = a;
    return d.julianDateToDate(a);
  }
  getCorrectDateForPositionalEphemeris(t, e, s, a) {
    const o = this.iteratePositionalEphemerisForObject(
      t,
      e,
      s
    );
    if (a > 0 && o.getDate() !== d.julianDateToDate(e).getDate()) {
      const n = d.julianDate(o), c = n > e ? -1 : 1;
      return this.getCorrectDateForPositionalEphemeris(
        t,
        n + c,
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
      l.NUMBERS_OF_ATTEMPT_TO_GET_POSITIONAL_EPHEMERIS
    );
  }
}
class u extends _ {
  constructor(t, e, s, a, o) {
    super(t, e), this.orbitalParameters = s, this.meanRadius = a, this.axialTilt = o;
  }
  /**
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
   */
  getRectangularHeliocentricCoordinates(t) {
    const e = d.julianCenturiesSinceEpoch2000(t), s = r.degreesToRadians(
      this.orbitalParameters.getInclination(e)
    ), a = r.degreesToRadians(
      this.orbitalParameters.getTrueAnomaly(e)
    ), o = r.degreesToRadians(
      this.orbitalParameters.getPerihelion(e)
    ), n = r.degreesToRadians(
      this.orbitalParameters.getAscendingNode(e)
    ), c = this.orbitalParameters.getOrbitRadius(
      e
    ), E = a + o - n, S = c * (Math.cos(n) * Math.cos(E) - Math.sin(n) * Math.sin(E) * Math.cos(s)), I = c * (Math.sin(n) * Math.cos(E) + Math.cos(n) * Math.sin(E) * Math.cos(s)), O = c * (Math.sin(E) * Math.sin(s));
    return new g(
      S,
      I,
      O,
      new _(h.STAR, "Sun")
    );
  }
}
class T {
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
  constructor(t, e, s, a, o, n, c, E, S, I, O, m) {
    this.a0 = t, this.e0 = e, this.i0 = s, this.o0 = a, this.w0 = o, this.l0 = n, this.ac = c, this.ec = E, this.ic = S, this.oc = I, this.wc = O, this.lc = m;
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
    return r.modDegrees(
      this.i0 + this.ic / 3600 * t
    );
  }
  getAscendingNode(t) {
    return r.modDegrees(
      this.o0 + this.oc / 3600 * t
    );
  }
  getPerihelion(t) {
    return r.modDegrees(
      this.w0 + this.wc / 3600 * t
    );
  }
  getMeanLongitude(t) {
    return r.modDegrees(
      this.l0 + this.lc / 3600 * t
    );
  }
  getMeanAnomaly(t) {
    return r.modDegrees(
      this.getMeanLongitude(t) - this.getPerihelion(t)
    );
  }
  /**
   *
   * @param julianCenturiesSinceEpoch2000
   * @returns {*} E: eccentric anomaly
   */
  getEccentricAnomaly(t) {
    const e = r.degreesToRadians(
      this.getMeanAnomaly(t)
    ), s = this.getEccentricity(t);
    let a = e + s * Math.sin(e) * (1 + s * Math.cos(e)), o = 0, n = 0, c = 0;
    for (; c++ < 1e4 && (o = a - (a - s * Math.sin(a) - e) / (1 - s * Math.cos(a)), n = o - a, a = o, !(Math.abs(n) <= l.EPS)); )
      ;
    return r.radiansToDegrees(o);
  }
  /**
   * @param julianCenturiesSinceEpoch2000
   * @returns V: true anomaly
   */
  getTrueAnomaly(t) {
    const e = this.getEccentricity(t), s = r.degreesToRadians(
      this.getEccentricAnomaly(t)
    ), a = 2 * Math.atan(
      Math.sqrt((1 + e) / (1 - e)) * Math.tan(0.5 * s)
    );
    return r.radiansToDegrees(a);
  }
  /**
   * R = (a * (1 - e^2)) / (1 + e * cos(V))
   * @param julianCenturiesSinceEpoch2000
   * @returns R: orbit radius
   */
  getOrbitRadius(t) {
    const e = this.getSemiMajorAxis(t), s = this.getEccentricity(t), a = this.getTrueAnomaly(t);
    return e * (1 - Math.pow(s, 2)) / (1 + s * Math.cos(r.degreesToRadians(a)));
  }
}
class L extends u {
  constructor() {
    const t = new T(
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
    super(h.PLANET, "Mercury", t, 2439700, 2.04);
  }
}
class P extends u {
  constructor() {
    const t = new T(
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
    super(h.PLANET, "Venus", t, 6051800, 2.64);
  }
}
class b extends u {
  constructor() {
    const t = new T(
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
    super(h.PLANET, "Earth", t, 6371e3, 23.439281);
  }
}
class y extends u {
  constructor() {
    const t = new T(
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
    super(h.PLANET, "Mars", t, 3389500, 25.19);
  }
}
class C extends u {
  constructor() {
    const t = new T(
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
    super(h.PLANET, "Jupiter", t, 69911e3, 3.13);
  }
}
class w extends u {
  constructor() {
    const t = new T(
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
    super(h.PLANET, "Saturn", t, 58232e3, 26.73);
  }
}
class j extends u {
  constructor() {
    const t = new T(
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
    super(h.PLANET, "Uranus", t, 25362e3, 97.77);
  }
}
class U extends u {
  constructor() {
    const t = new T(
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
    super(h.PLANET, "Neptune", t, 24622e3, 28.32);
  }
}
const p = [
  new L(),
  new P(),
  new b(),
  new y(),
  new C(),
  new w(),
  new j(),
  new U()
];
class G extends u {
  constructor() {
    const t = new T(
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
    super(h.PLANET, "Pluto", t, 1188300, 122.53);
  }
}
const F = [new G()];
class D extends u {
  constructor() {
    super(h.STAR, "Sun", null, 695508e3, 0);
  }
  getRectangularHeliocentricCoordinates(t) {
    return new g(0, 0, 0, new D());
  }
}
const H = [new D()].concat(p).concat(F);
class M {
  constructor() {
    this.skyObjects = [...H], this.astronomicalCalculator = new R(), this.julianDate = null, this.date = null;
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
    this.date = t, this.setJulianDate(d.julianDate(t));
  }
  getSkyObjectByName(t) {
    return this.skyObjects.find((e) => e.name === t) || null;
  }
  getEphemerisTypeByName(t) {
    return Object.values(l.EPHEMERIS_TYPE).find(
      (e) => e.NAME === t
    ) || null;
  }
  setLocation(t, e, s, a) {
    const o = this.getSkyObjectByName(t);
    if (!o)
      throw new Error(`Solar system object "${t}" not found`);
    this.astronomicalCalculator = new R(
      new A(
        e,
        s,
        o.meanRadius + a
      ),
      o
    );
  }
  getLatitudeLongitudeCoordinates() {
    return {
      latitude: this.astronomicalCalculator.observerSphericalCoordinates.latitude,
      longitude: this.astronomicalCalculator.observerSphericalCoordinates.longitude
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
  getAltAzCoordinatesForObject(t, e) {
    const s = this.getSkyObjectByName(t);
    if (!s)
      throw new Error(`Object "${t}" not found`);
    const a = e ? d.julianDate(e) : this.julianDate;
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
    let s = new M();
    return s.setLocation("Earth", t, e, 0), s.setDate(/* @__PURE__ */ new Date()), s;
  }
  getEphemerisDateForObject(t, e, s) {
    const a = this.getSkyObjectByName(t), o = this.getEphemerisTypeByName(s);
    if (!a || !o)
      throw new Error("Invalid object name or ephemeris type");
    return this.astronomicalCalculator.getDateForPositionalEphemeris(
      a,
      d.julianDate(e),
      o
    );
  }
}
function x(i, t) {
  return M.initialize(i, t);
}
export {
  M as AstronomyJS,
  x as initialize
};
