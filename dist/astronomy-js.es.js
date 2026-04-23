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
//#region lib/constants.js
var e = {
	SOLAR_SYSTEM_OBJECT: "SOLAR_SYSTEM_OBJECT",
	GREENWICH_OBSERVATORY_COORDINATES: {
		LATITUDE: 51.476852,
		LONGITUDE: -5e-4,
		RADIUS: 6371046,
		ELEVATION: 46
	},
	KIRUNA_COORDINATES: {
		LATITUDE: 67.85,
		LONGITUDE: 20.21,
		RADIUS: 6371500,
		ELEVATION: 500
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
	MS_PER_HOUR: 3600 * 1e3,
	MS_PER_DAY: 3600 * 1e3 * 24,
	MS_PER_YEAR: 3600 * 1e3 * 24 * 365.2422,
	JULIAN_DAY_OFFSET: 2440587.5,
	JULIAN_DAY_2000: 2451545,
	JULIAN_DAY_2010: 2455197.5,
	EPS: 10 ** -9,
	DEGREE: Math.PI / 180,
	NUMBERS_OF_ATTEMPT_TO_GET_POSITIONAL_EPHEMERIS: 5,
	ARC_SECONDS_IN_A_DEGREE: 3600,
	DAYS_PER_JULIAN_CENTURY: 36525,
	METERS_PER_AU: 149597870700
}, t = class {
	static julianDate(t) {
		return t / e.MS_PER_DAY + e.JULIAN_DAY_OFFSET;
	}
	static julianDateToDate(t) {
		return new Date((t - e.JULIAN_DAY_OFFSET) * e.MS_PER_DAY);
	}
	static julianDaysSinceEpoch2000(t) {
		return t - e.JULIAN_DAY_2000;
	}
	static julianCenturiesSinceEpoch2000(t) {
		return this.julianDaysSinceEpoch2000(t) / e.DAYS_PER_JULIAN_CENTURY;
	}
}, n = class {
	static modDegrees(e) {
		for (; e < 0;) e += 360;
		return e % 360;
	}
	static mod180Degrees(e) {
		let t = this.modDegrees(e);
		return t > 180 ? t - 360 : t;
	}
	static modRadians(e) {
		for (; e < 0;) e += 2 * Math.PI;
		return e % (2 * Math.PI);
	}
	static modPiRadians(e) {
		let t = this.modRadians(e);
		return t > Math.PI ? t - 2 * Math.PI : t;
	}
	static radiansToDegrees(e) {
		return 180 / Math.PI * e;
	}
	static degreesToRadians(e) {
		return Math.PI / 180 * e;
	}
}, r = class e {
	constructor(e, t, n, r) {
		this.x = e, this.y = t, this.z = n, this.center = r;
	}
	minus(t, n) {
		return new e(this.x - t.x, this.y - t.y, this.z - t.z, n);
	}
}, i = class {
	constructor(e, t, n, r) {
		this.lambda = e, this.beta = t, this.delta = n, this.center = r;
	}
}, a = class {
	constructor(e, t, n, r, i) {
		this.rightAscension = e, this.declination = t, this.delta = n, this.obliquity = r, this.center = i;
	}
}, o = class {
	constructor(e, t, n, r) {
		this.azimuth = e, this.altitude = t, this.distance = n, this.observerLocation = r;
	}
}, s = class {
	constructor(e, t, n, r) {
		this.rightAscension = e, this.declination = t, this.distance = n, this.observerLocation = r;
	}
}, c = class {
	static eclipticRectangularToEclipticSphericalCoordinates(e) {
		let t = Math.sqrt(e.x * e.x + e.y * e.y + e.z * e.z), n = Math.atan2(e.y, e.x) * (180 / Math.PI), r = Math.asin(e.z / t) * (180 / Math.PI);
		return new i((n + 360) % 360, r, t, e.center);
	}
	static eclipticSphericalToEquatorialSphericalCoordinates(e, t) {
		let r = n.degreesToRadians(e.lambda), i = n.degreesToRadians(e.beta), o = n.degreesToRadians(t), s = Math.sin(i) * Math.cos(o) + Math.cos(i) * Math.sin(o) * Math.sin(r), c = Math.sin(r) * Math.cos(o) - Math.tan(i) * Math.sin(o), l = Math.atan2(c, Math.cos(r));
		return new a(n.modDegrees(n.radiansToDegrees(l)), n.radiansToDegrees(Math.asin(s)), e.delta, t, e.center);
	}
	static equatorialSphericalToTopocentricEquatorialSphericalCoordinates(t, r, i) {
		let a = t.center.meanRadius, o = n.degreesToRadians(t.rightAscension), c = n.degreesToRadians(t.declination), l = n.degreesToRadians(r.latitude), u = n.degreesToRadians(i), d = Math.atan((1 - t.center.flattening) * Math.tan(l)), f = (1 - t.center.flattening) * Math.sin(d) + r.elevation / a * Math.sin(l), p = Math.cos(d) + r.elevation / a * Math.cos(l), m = Math.asin(t.center.meanRadius / e.METERS_PER_AU / t.delta), h = u - o, g = Math.atan2(-p * Math.sin(m) * Math.sin(h), Math.cos(c) - p * Math.sin(m) * Math.cos(h));
		return new s(n.modDegrees(n.radiansToDegrees(o + g)), n.radiansToDegrees(Math.atan2((Math.sin(c) - f * Math.sin(m)) * Math.cos(g), Math.cos(c) - p * Math.sin(m) * Math.cos(h))), null, r);
	}
	static topocentricEquatorialToTopocentricHorizontalSphericalCoordinates(e, t) {
		let r = n.degreesToRadians(e.rightAscension), i = n.degreesToRadians(e.declination), a = n.degreesToRadians(e.observerLocation.latitude), s = n.degreesToRadians(t) - r, c = Math.asin(Math.sin(a) * Math.sin(i) + Math.cos(a) * Math.cos(i) * Math.cos(s)), l = Math.atan2(Math.sin(s), Math.cos(s) * Math.sin(a) - Math.tan(i) * Math.cos(a)), u = n.radiansToDegrees(c);
		return new o(n.modDegrees(n.radiansToDegrees(l) + 180), u, null, e.observerLocation);
	}
}, l = class {
	constructor(e, t, n) {
		this.hourAngle = e, this.declination = t, this.distance = n;
	}
}, u = class i {
	static getTopocentricEquatorialSphericalCoordinates(e, t, n) {
		let r = e.center.getRectangularHeliocentricCoordinates(n), i = t.getRectangularHeliocentricCoordinates(n), o = i.minus(r, i.center), s = c.eclipticRectangularToEclipticSphericalCoordinates(o), l = c.eclipticSphericalToEquatorialSphericalCoordinates(s, e.center.getObliquity(n)), u = l.rightAscension, d = l.declination, f = l.delta, p = this.getLocalMeanSiderealTime(e, n), m = new a(u, d, f, e.center.getObliquity(n), e.center);
		return c.equatorialSphericalToTopocentricEquatorialSphericalCoordinates(m, e, p);
	}
	static getTopocentricHorizontalSphericalCoordinatesForSolarSystemObject(e, t, n) {
		let r = i.getTopocentricEquatorialSphericalCoordinates(e, t, n), a = this.getLocalMeanSiderealTime(e, n);
		return c.topocentricEquatorialToTopocentricHorizontalSphericalCoordinates(r, a);
	}
	static getRectangularObjectCentricCoordinatesForSolarSystemObject(e, t, n) {
		return t.getRectangularHeliocentricCoordinates(n).minus(e.center.getRectangularHeliocentricCoordinates(n), e.center);
	}
	static getRectangularEquatorialCoordinatesForSolarSystemObject(e, t, i) {
		let a = this.getRectangularObjectCentricCoordinatesForSolarSystemObject(e, t, i), o = n.degreesToRadians(e.center.axialTilt);
		return new r(a.x, a.y * Math.cos(o) - a.z * Math.sin(o), a.y * Math.sin(o) + a.z * Math.cos(o));
	}
	static getDistanceToSolarSystemObject(e, t, n) {
		let r = this.getRectangularObjectCentricCoordinatesForSolarSystemObject(e, t, n);
		return Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2);
	}
	static getHADecCoordinatesForSolarSystemObject(e, t, r) {
		let a = this.getTopocentricEquatorialSphericalCoordinates(e, t, r);
		return new l(n.modDegrees(i.getLocalMeanSiderealTime(e, r) - a.rightAscension), a.declination, a.distance);
	}
	static getLocalMeanSiderealTime(e, t) {
		return n.modDegrees(e.center.getPrimeMeridianMeanSiderealTime(t) + e.longitude);
	}
	static getObjectTransit(e, t, n) {
		let r = this.getTopocentricEquatorialSphericalCoordinates(e, t, n).rightAscension;
		return this.getLocalMeanSiderealTime(e, n) - r;
	}
	static getObjectLowerTransit(e, t, r) {
		let i = this.getTopocentricEquatorialSphericalCoordinates(e, t, r).rightAscension, a = this.getLocalMeanSiderealTime(e, r) - i - 180;
		return n.mod180Degrees(a);
	}
	static getObjectLocalHourAngleForAltitude(e, t, r, i) {
		let a = n.degreesToRadians(e.latitude), o = n.degreesToRadians(i), s = n.degreesToRadians(this.getTopocentricEquatorialSphericalCoordinates(e, t, r).declination), c = (Math.sin(o) - Math.sin(a) * Math.sin(s)) / (Math.cos(a) * Math.cos(s));
		return n.radiansToDegrees(Math.acos(c));
	}
	static getIterationValueForPositionalEphemerisForObject(t, r, i, a) {
		if (a === e.EPHEMERIS_TYPE.TRANSIT) return i - this.getObjectTransit(t, r, i) / 15 / 24;
		if (a === e.EPHEMERIS_TYPE.LOWER_TRANSIT) return i - this.getObjectLowerTransit(t, r, i) / 15 / 24;
		{
			let e = this.getObjectTransit(t, r, i), o = this.getObjectLocalHourAngleForAltitude(t, r, i, a.ALTITUDE);
			return i - n.mod180Degrees(a.IS_GOING_UP ? e + o : e - o) / 15 / 24;
		}
	}
	static iteratePositionalEphemerisForObject(e, n, r, i) {
		let a = this.getIterationValueForPositionalEphemerisForObject(e, n, r, i), o = +a;
		for (let t = 0; t < 1e3 && !isNaN(a) && (a = this.getIterationValueForPositionalEphemerisForObject(e, n, a, i), !(Math.abs(a - o) < 1e-5)); t++) o = a;
		return t.julianDateToDate(a);
	}
	static getCorrectDateForPositionalEphemeris(e, n, r, i, a) {
		let o = this.iteratePositionalEphemerisForObject(e, n, r, i);
		if (a > 0 && o.getDate() !== t.julianDateToDate(r).getDate()) {
			let s = t.julianDate(o), c = s > r ? -1 : 1;
			return this.getCorrectDateForPositionalEphemeris(e, n, s + c, i, a - 1);
		} else if (a === 0) return null;
		else return o;
	}
	static getDateForPositionalEphemeris(t, n, r, i) {
		return this.getCorrectDateForPositionalEphemeris(t, n, r, i, e.NUMBERS_OF_ATTEMPT_TO_GET_POSITIONAL_EPHEMERIS);
	}
	static getIlluminatedFractionForObject(e, t, n) {
		let r = e.center.getRectangularHeliocentricCoordinates(n), i = t.getRectangularHeliocentricCoordinates(n), a = {
			x: -i.x,
			y: -i.y,
			z: -i.z
		}, o = {
			x: r.x - i.x,
			y: r.y - i.y,
			z: r.z - i.z
		}, s = a.x * o.x + a.y * o.y + a.z * o.z, c = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z), l = Math.sqrt(o.x * o.x + o.y * o.y + o.z * o.z);
		return (1 + Math.max(-1, Math.min(1, s / (c * l)))) / 2;
	}
}, d = class {
	constructor(e, t) {
		this.skyObjectType = e, this.name = t;
	}
}, f = {
	PLANET: "planet",
	STAR: "star",
	SATELLITE: "satellite",
	COMET: "comet",
	SUN: "sun"
}, p = class e extends d {
	constructor(e, t, n, r, i, a) {
		super(e, t), this.orbitalParameters = n, this.meanRadius = r, this.axialTilt = i, this.flattening = a;
	}
	static getRectangularHeliocentricCoordinatesFromOrbitalParameters(e, i) {
		let a = t.julianCenturiesSinceEpoch2000(i), o = n.degreesToRadians(e.getInclination(a)), s = n.degreesToRadians(e.getTrueAnomaly(a)), c = n.degreesToRadians(e.getPerihelion(a)), l = n.degreesToRadians(e.getAscendingNode(a)), u = e.getOrbitRadius(a), d = s + c - l;
		return new r(u * (Math.cos(l) * Math.cos(d) - Math.sin(l) * Math.sin(d) * Math.cos(o)), u * (Math.sin(l) * Math.cos(d) + Math.cos(l) * Math.sin(d) * Math.cos(o)), Math.sin(d) * Math.sin(o) * u, null);
	}
	getRectangularHeliocentricCoordinates(t) {
		return e.getRectangularHeliocentricCoordinatesFromOrbitalParameters(this.orbitalParameters, t);
	}
	getObliquity(e) {
		return this.axialTilt;
	}
	getPrimeMeridianMeanSiderealTime(e) {
		throw Error("Not implemented");
	}
}, m = class {
	constructor(e, t, n, r, i, a, o, s, c, l, u, d) {
		this.a0 = e, this.e0 = t, this.i0 = n, this.o0 = r, this.w0 = i, this.l0 = a, this.ac = o, this.ec = s, this.ic = c, this.oc = l, this.wc = u, this.lc = d;
	}
	getSemiMajorAxis(e) {
		return this.a0 + this.ac * e;
	}
	getEccentricity(e) {
		return this.e0 + this.ec * e;
	}
	getInclination(e) {
		return n.modDegrees(this.i0 + this.ic / 3600 * e);
	}
	getAscendingNode(e) {
		return n.modDegrees(this.o0 + this.oc / 3600 * e);
	}
	getPerihelion(e) {
		return n.modDegrees(this.w0 + this.wc / 3600 * e);
	}
	getMeanLongitude(e) {
		return n.modDegrees(this.l0 + this.lc / 3600 * e);
	}
	getMeanAnomaly(e) {
		return n.modDegrees(this.getMeanLongitude(e) - this.getPerihelion(e));
	}
	getEccentricAnomaly(t) {
		let r = n.degreesToRadians(this.getMeanAnomaly(t)), i = this.getEccentricity(t), a = r + i * Math.sin(r) * (1 + i * Math.cos(r)), o = 0, s = 0, c = 0;
		for (; c++ < 1e4 && (o = a - (a - i * Math.sin(a) - r) / (1 - i * Math.cos(a)), s = o - a, a = o, !(Math.abs(s) <= e.EPS)););
		return n.radiansToDegrees(o);
	}
	getTrueAnomaly(e) {
		let t = this.getEccentricity(e), r = n.degreesToRadians(this.getEccentricAnomaly(e)), i = 2 * Math.atan(Math.sqrt((1 + t) / (1 - t)) * Math.tan(.5 * r));
		return n.radiansToDegrees(i);
	}
	getOrbitRadius(e) {
		let t = this.getSemiMajorAxis(e), r = this.getEccentricity(e), i = this.getTrueAnomaly(e);
		return t * (1 - r ** 2) / (1 + r * Math.cos(n.degreesToRadians(i)));
	}
}, h = class extends p {
	constructor() {
		let e = new m(.38709893, .20563069, 7.00487, 48.33167, 77.45645, 252.25084, 66e-8, 2527e-8, -23.51, -446.3, 573.57, 538101628.29);
		super(f.PLANET, "Mercury", e, 2439700, 2.04);
	}
}, g = class extends p {
	constructor() {
		let e = new m(.72333199, .00677323, 3.39471, 76.68069, 131.53298, 181.97973, 92e-8, -4938e-8, -2.86, -996.89, -108.8, 210664136.06);
		super(f.PLANET, "Venus", e, 6051800, 2.64);
	}
}, _ = class extends p {
	constructor() {
		let e = new m(1.00000011, .01671022, 5e-5, -11.26064, 102.94719, 100.46435, -5e-8, -3804e-8, -46.94, -18228.25, 1198.28, 129597740.63);
		super(f.PLANET, "Earth", e, 6378137, 23.439281, 1 / 298.257223563);
	}
	getObliquity(e) {
		let n = t.julianCenturiesSinceEpoch2000(e);
		return 23.43929111 - 46.815 * n / 3600 - 6e-4 * n * n / 3600 + .001813 * n * n * n / 3600;
	}
	getPrimeMeridianMeanSiderealTime(e) {
		let r = t.julianDaysSinceEpoch2000(e), i = t.julianCenturiesSinceEpoch2000(e), a = 280.46061837 + 360.98564736629 * r + 387933e-9 * i * i - i * i * i / 3871e4;
		return n.modDegrees(a);
	}
}, v = class extends p {
	constructor() {
		let e = new m(1.52366231, .09341233, 1.85061, 49.57854, 336.04084, 355.45332, -7221e-8, 11902e-8, -25.47, -1020.19, 1560.78, 68905103.78);
		super(f.PLANET, "Mars", e, 3389500, 25.19);
	}
}, y = class extends p {
	constructor() {
		let e = new m(5.20336301, .04839266, 1.3053, 100.55615, 14.75385, 34.40438, 60737e-8, -1288e-7, -4.15, 1217.17, 839.93, 10925078.35);
		super(f.PLANET, "Jupiter", e, 69911e3, 3.13);
	}
}, b = class extends p {
	constructor() {
		let e = new m(9.53707032, .0541506, 2.48446, 113.71504, 92.43194, 49.94432, -.0030153, -36762e-8, 6.11, -1591.05, -1948.89, 4401052.95);
		super(f.PLANET, "Saturn", e, 58232e3, 26.73);
	}
}, x = class extends p {
	constructor() {
		let e = new m(19.19126393, .04716771, .76986, 74.22988, 170.96424, 313.23218, .00152025, -1915e-7, -2.09, -1681.4, 1312.56, 1542547.79);
		super(f.PLANET, "Uranus", e, 25362e3, 97.77);
	}
}, S = class extends p {
	constructor() {
		let e = new m(30.06896348, .00858587, 1.76917, 131.72169, 44.97135, 304.88003, -.00125196, 251e-7, -3.64, -151.25, -844.43, 786449.21);
		super(f.PLANET, "Neptune", e, 24622e3, 28.32);
	}
}, C = [
	new h(),
	new g(),
	new _(),
	new v(),
	new y(),
	new b(),
	new x(),
	new S()
], w = [new class extends p {
	constructor() {
		let e = new m(39.48168677, .24880766, 17.14175, 110.30347, 113.76329, 238.92881, -2.07e-8, 6465e-8, 501e-8, -37.033, 7.765, 145.2078);
		super(f.PLANET, "Pluto", e, 1188300, 122.53);
	}
}()], T = [new class extends p {
	constructor() {
		super(f.SATELLITE, "Moon", null, 1737400, 1.5424);
	}
	getRectangularHeliocentricCoordinates(e) {
		let n = t.julianCenturiesSinceEpoch2000(e), i = n * n, a = i * n, o = a * n, s = 218.3164477 + 481267.88123421 * n - .0015786 * i + a / 538841 - o / 65194e3, c = 297.8501921 + 445267.1114034 * n - .0018819 * i + a / 545868 - o / 113065e3, l = 357.5291092 + 35999.0502909 * n - 1536e-7 * i + a / 2449e4, u = 134.9633964 + 477198.8675055 * n + .0087414 * i + a / 69699 - o / 14712e3, d = 93.272095 + 483202.0175233 * n - .0036539 * i - a / 3526e3 + o / 86331e4, f = 119.75 + 131.849 * n, p = 53.09 + 479264.29 * n, m = 313.45 + 481266.484 * n, h = 1 - .002516 * n - 74e-7 * i, g = (e) => e * Math.PI / 180, v = [
			[
				0,
				0,
				1,
				0,
				6288774,
				-20905355
			],
			[
				2,
				0,
				-1,
				0,
				1274027,
				-3699111
			],
			[
				2,
				0,
				0,
				0,
				658314,
				-2955968
			],
			[
				0,
				0,
				2,
				0,
				213618,
				-569925
			],
			[
				0,
				1,
				0,
				0,
				-185116,
				48888
			],
			[
				0,
				0,
				0,
				2,
				-114332,
				-3149
			],
			[
				2,
				0,
				-2,
				0,
				58793,
				246158
			],
			[
				2,
				-1,
				-1,
				0,
				57066,
				-152138
			],
			[
				2,
				0,
				1,
				0,
				53322,
				-170733
			],
			[
				2,
				-1,
				0,
				0,
				45758,
				-204596
			],
			[
				0,
				1,
				-1,
				0,
				-40923,
				-129620
			],
			[
				1,
				0,
				0,
				0,
				-34720,
				108743
			],
			[
				0,
				1,
				1,
				0,
				-30383,
				104755
			],
			[
				2,
				0,
				0,
				-2,
				15327,
				10321
			],
			[
				0,
				0,
				1,
				2,
				-12528,
				0
			],
			[
				0,
				0,
				1,
				-2,
				10980,
				79661
			],
			[
				4,
				0,
				-1,
				0,
				10675,
				-34782
			],
			[
				0,
				0,
				3,
				0,
				10034,
				-23210
			],
			[
				4,
				0,
				-2,
				0,
				8548,
				-21636
			],
			[
				2,
				1,
				-1,
				0,
				-7888,
				24208
			],
			[
				2,
				1,
				0,
				0,
				-6766,
				30824
			],
			[
				1,
				0,
				-1,
				0,
				-5163,
				-8379
			],
			[
				1,
				1,
				0,
				0,
				4987,
				-16675
			],
			[
				2,
				-1,
				1,
				0,
				4036,
				-12831
			],
			[
				2,
				0,
				2,
				0,
				3994,
				-10445
			],
			[
				4,
				0,
				0,
				0,
				3861,
				-11650
			],
			[
				2,
				0,
				-3,
				0,
				3665,
				14403
			],
			[
				0,
				1,
				-2,
				0,
				-2689,
				-7003
			],
			[
				2,
				0,
				-1,
				2,
				-2602,
				0
			],
			[
				2,
				-1,
				-2,
				0,
				2390,
				10056
			],
			[
				1,
				0,
				1,
				0,
				-2348,
				6322
			],
			[
				2,
				-2,
				0,
				0,
				2236,
				-9884
			],
			[
				0,
				1,
				2,
				0,
				-2120,
				5751
			],
			[
				0,
				2,
				0,
				0,
				-2069,
				0
			],
			[
				2,
				-2,
				-1,
				0,
				2048,
				-4950
			],
			[
				2,
				0,
				1,
				-2,
				-1773,
				4130
			],
			[
				2,
				0,
				0,
				2,
				-1595,
				0
			],
			[
				4,
				-1,
				-1,
				0,
				1215,
				-3958
			],
			[
				0,
				0,
				2,
				2,
				-1110,
				0
			],
			[
				3,
				0,
				-1,
				0,
				-892,
				3258
			],
			[
				2,
				1,
				1,
				0,
				-810,
				2616
			],
			[
				4,
				-1,
				-2,
				0,
				759,
				-1897
			],
			[
				0,
				2,
				-1,
				0,
				-713,
				-2117
			],
			[
				2,
				2,
				-1,
				0,
				-700,
				2354
			],
			[
				2,
				1,
				-2,
				0,
				691,
				0
			],
			[
				2,
				-1,
				0,
				-2,
				596,
				0
			],
			[
				4,
				0,
				1,
				0,
				549,
				-1423
			],
			[
				0,
				0,
				4,
				0,
				537,
				-1117
			],
			[
				4,
				-1,
				0,
				0,
				520,
				-1571
			],
			[
				1,
				0,
				-2,
				0,
				-487,
				-1739
			],
			[
				2,
				1,
				0,
				-2,
				-399,
				0
			],
			[
				0,
				0,
				2,
				-2,
				-381,
				-4421
			],
			[
				1,
				1,
				1,
				0,
				351,
				0
			],
			[
				3,
				0,
				-2,
				0,
				-340,
				0
			],
			[
				4,
				0,
				-3,
				0,
				330,
				0
			],
			[
				2,
				-1,
				2,
				0,
				327,
				0
			],
			[
				0,
				2,
				1,
				0,
				-323,
				1165
			],
			[
				1,
				1,
				-1,
				0,
				299,
				0
			],
			[
				2,
				0,
				3,
				0,
				294,
				0
			],
			[
				2,
				0,
				-1,
				-2,
				0,
				8752
			]
		], y = [
			[
				0,
				0,
				0,
				1,
				5128122
			],
			[
				0,
				0,
				1,
				1,
				280602
			],
			[
				0,
				0,
				1,
				-1,
				277693
			],
			[
				2,
				0,
				0,
				-1,
				173237
			],
			[
				2,
				0,
				-1,
				1,
				55413
			],
			[
				2,
				0,
				-1,
				-1,
				46271
			],
			[
				2,
				0,
				0,
				1,
				32573
			],
			[
				0,
				0,
				2,
				1,
				17198
			],
			[
				2,
				0,
				1,
				-1,
				9266
			],
			[
				0,
				0,
				2,
				-1,
				8822
			],
			[
				2,
				-1,
				0,
				-1,
				8216
			],
			[
				2,
				0,
				-2,
				-1,
				4324
			],
			[
				2,
				0,
				1,
				1,
				4200
			],
			[
				2,
				1,
				0,
				-1,
				-3359
			],
			[
				2,
				-1,
				-1,
				1,
				2463
			],
			[
				2,
				-1,
				0,
				1,
				2211
			],
			[
				2,
				-1,
				-1,
				-1,
				2065
			],
			[
				0,
				1,
				-1,
				-1,
				-1870
			],
			[
				4,
				0,
				-1,
				-1,
				1828
			],
			[
				0,
				1,
				0,
				1,
				-1794
			],
			[
				0,
				0,
				0,
				3,
				-1749
			],
			[
				0,
				1,
				-1,
				1,
				-1565
			],
			[
				1,
				0,
				0,
				1,
				-1491
			],
			[
				0,
				1,
				1,
				1,
				-1475
			],
			[
				0,
				1,
				1,
				-1,
				-1410
			],
			[
				0,
				1,
				0,
				-1,
				-1344
			],
			[
				1,
				0,
				0,
				-1,
				-1335
			],
			[
				0,
				0,
				3,
				1,
				1107
			],
			[
				4,
				0,
				0,
				-1,
				1021
			],
			[
				4,
				0,
				-1,
				1,
				833
			],
			[
				0,
				0,
				1,
				-3,
				777
			],
			[
				4,
				0,
				-2,
				1,
				671
			],
			[
				2,
				0,
				0,
				-3,
				607
			],
			[
				2,
				0,
				2,
				-1,
				596
			],
			[
				2,
				-1,
				1,
				-1,
				491
			],
			[
				2,
				0,
				-2,
				1,
				-451
			],
			[
				0,
				0,
				3,
				-1,
				439
			],
			[
				2,
				0,
				2,
				1,
				422
			],
			[
				2,
				0,
				-3,
				-1,
				421
			],
			[
				2,
				1,
				-1,
				1,
				-366
			],
			[
				2,
				1,
				0,
				1,
				-351
			],
			[
				4,
				0,
				0,
				1,
				331
			],
			[
				2,
				-1,
				1,
				1,
				315
			],
			[
				2,
				-2,
				0,
				-1,
				302
			],
			[
				0,
				0,
				1,
				3,
				-283
			],
			[
				2,
				1,
				1,
				-1,
				-229
			],
			[
				1,
				1,
				0,
				-1,
				223
			],
			[
				1,
				1,
				0,
				1,
				223
			],
			[
				0,
				1,
				-2,
				-1,
				-220
			],
			[
				2,
				1,
				-1,
				-1,
				-220
			],
			[
				1,
				0,
				1,
				1,
				-185
			],
			[
				2,
				-1,
				-2,
				-1,
				181
			],
			[
				0,
				1,
				2,
				1,
				-177
			],
			[
				4,
				0,
				-2,
				-1,
				176
			],
			[
				4,
				-1,
				-1,
				-1,
				166
			],
			[
				1,
				0,
				1,
				-1,
				-164
			],
			[
				4,
				0,
				1,
				-1,
				132
			],
			[
				1,
				0,
				-1,
				-1,
				-119
			],
			[
				4,
				-1,
				0,
				-1,
				115
			],
			[
				2,
				-2,
				0,
				1,
				107
			]
		], b = 0;
		for (let [e, t, n, r, i, a] of v) {
			let a = e * g(c) + t * g(l) + n * g(u) + r * g(d);
			b += i * h ** +Math.abs(t) * Math.sin(a);
		}
		let x = 0;
		for (let [e, t, n, r, i, a] of v) {
			let i = e * g(c) + t * g(l) + n * g(u) + r * g(d);
			x += a * h ** +Math.abs(t) * Math.cos(i);
		}
		let S = 0;
		for (let [e, t, n, r, i] of y) {
			let a = e * g(c) + t * g(l) + n * g(u) + r * g(d);
			S += i * h ** +Math.abs(t) * Math.sin(a);
		}
		b = b + 3958 * Math.sin(g(f)) + 1962 * Math.sin(g(s - d)) + 318 * Math.sin(g(p)), S = S - 2235 * Math.sin(g(s)) + 382 * Math.sin(g(m)) + 175 * Math.sin(g(f - d)) + 175 * Math.sin(g(f + d)) + 127 * Math.sin(g(s - u)) - 115 * Math.sin(g(s + u));
		let C = s + b / 1e6, w = S / 1e6, T = 385000.56 + x / 1e3, E = g(C), D = g(w), O = T / 149597870.7, k = {
			x: O * Math.cos(D) * Math.cos(E),
			y: O * Math.cos(D) * Math.sin(E),
			z: O * Math.sin(D)
		}, A = new _().getRectangularHeliocentricCoordinates(e);
		return new r(A.x + k.x, A.y + k.y, A.z + k.z);
	}
}()], E = [new class extends p {
	constructor() {
		super(f.SUN, "Sun", null, 695508e3, 0);
	}
	getRectangularHeliocentricCoordinates(e) {
		return new r(0, 0, 0, this);
	}
}()].concat(C, T, w), D = class {
	constructor(e, t, n, r) {
		this.longitude = e, this.latitude = t, this.elevation = n, this.center = r;
	}
}, O = class n {
	constructor() {
		this.skyObjects = [...E], this.observerLocation = null, this.julianDate = null, this.simulationDate = null;
	}
	static initialize(e, t) {
		let r = new n();
		return r.setLocation("Earth", e, t, 0), r.setDate(/* @__PURE__ */ new Date()), r;
	}
	getJulianDate() {
		return this.julianDate;
	}
	setJulianDate(e) {
		this.julianDate = e;
	}
	getDate() {
		return this.simulationDate;
	}
	setDate(e) {
		this.simulationDate = e, this.setJulianDate(t.julianDate(e));
	}
	getSkyObjectByName(e) {
		return this.skyObjects.find((t) => t.name === e) || null;
	}
	getEphemerisTypeByName(t) {
		return Object.values(e.EPHEMERIS_TYPE).find((e) => e.NAME === t) || null;
	}
	setLocation(e, t, n, r) {
		let i = this.getSkyObjectByName(e);
		if (!i) throw Error(`Solar system object "${e}" not found`);
		this.observerLocation = new D(n, t, r, i);
	}
	getRightAscensionDeclinationCoordinatesForObject(e, n) {
		let r = this.getSkyObjectByName(e);
		if (!r || this.julianDate === null) throw Error("Invalid object name or Julian date not set");
		let i = n ? t.julianDate(n) : this.julianDate;
		return u.getTopocentricEquatorialSphericalCoordinates(this.observerLocation, r, i);
	}
	getHourAngleDeclinationCoordinatesForObject(e, n) {
		let r = this.getSkyObjectByName(e);
		if (!r || this.julianDate === null) throw Error("Invalid object name or Julian date not set");
		let i = n ? t.julianDate(n) : this.julianDate;
		return u.getHADecCoordinatesForSolarSystemObject(this.observerLocation, r, i);
	}
	getAltitudeAzimuthCoordinatesForObject(e, n) {
		let r = this.getSkyObjectByName(e);
		if (!r) throw Error(`Object "${e}" not found`);
		let i = n ? t.julianDate(n) : this.julianDate;
		return u.getTopocentricHorizontalSphericalCoordinatesForSolarSystemObject(this.observerLocation, r, i);
	}
	getIlluminatedFractionForObject(e, n) {
		let r = this.getSkyObjectByName(e);
		if (!r) throw Error(`Object "${e}" not found`);
		let i = n ? t.julianDate(n) : this.julianDate;
		return u.getIlluminatedFractionForObject(this.observerLocation, r, i);
	}
	getLocalMeanSiderealTime() {
		if (this.julianDate === null) throw Error("Julian date not set");
		return u.getLocalMeanSiderealTime(this.observerLocation, this.julianDate);
	}
	getEphemerisDateForObject(e, n, r) {
		let i = this.getSkyObjectByName(e), a = this.getEphemerisTypeByName(r);
		if (!i || !a) throw Error("Invalid object name or ephemeris type");
		return u.getDateForPositionalEphemeris(this.observerLocation, i, t.julianDate(n), a);
	}
	getObserverLocation() {
		return this.observerLocation;
	}
	getLatitudeLongitudeCoordinates() {
		return this.observerLocation ? {
			latitude: this.observerLocation.latitude,
			longitude: this.observerLocation.longitude
		} : null;
	}
};
function k(e, t) {
	return O.initialize(e, t);
}
//#endregion
export { O as AstronomyJS, k as initialize };
