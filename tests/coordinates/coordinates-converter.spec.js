import { describe, it, expect } from "vitest";
import { CoordinatesConverter } from "../../lib/coordinates/coordinates-converter.js";
import { EclipticRectangularCoordinates } from "../../lib/coordinates/types/ecliptic-rectangular-coordinates.js";
import { SkyObject } from "../../lib/sky-object.js";
import { SkyObjectType } from "../../lib/sky-object-type.js";
import { EclipticSphericalCoordinates } from "../../lib/coordinates/types/ecliptic-spherical-coordinates.js";
import { Constants } from "../../lib/constants.js";
import { EquatorialSphericalCoordinates } from "../../lib/coordinates/types/equatorial-spherical-coordinates.js";
import { Earth } from "../../lib/solar-system-objects/planets/earth.js";
import { TopocentricEquatorialSphericalCoordinates } from "../../lib/coordinates/types/topocentric-equatorial-spherical-coordinates.js";

const Sun = new SkyObject(SkyObjectType.STAR, "Sun");

describe("CoordinatesConverter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates", () => {
  it("converts unit vector on +X axis (lambda=0°, beta=0°, r=1)", () => {
    const rectangular = new EclipticRectangularCoordinates(1, 0, 0, Sun);
    const spherical =
      CoordinatesConverter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
        rectangular,
      );
    expect(spherical.lambda).toBeCloseTo(0, 12);
    expect(spherical.beta).toBeCloseTo(0, 12);
    expect(spherical.delta).toBeCloseTo(1, 12);
    expect(spherical.center).toStrictEqual(Sun);
  });

  it("converts unit vector on +Y axis (lambda=90°, beta=0°, r=1)", () => {
    const rectangular = new EclipticRectangularCoordinates(0, 1, 0, Sun);
    const spherical =
      CoordinatesConverter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
        rectangular,
      );
    expect(spherical.lambda).toBeCloseTo(90, 12);
    expect(spherical.beta).toBeCloseTo(0, 12);
    expect(spherical.delta).toBeCloseTo(1, 12);
  });

  it("converts unit vector on -X axis (lambda=180°, beta=0°, r=1)", () => {
    const rectangular = new EclipticRectangularCoordinates(-1, 0, 0, Sun);
    const spherical =
      CoordinatesConverter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
        rectangular,
      );
    expect(spherical.lambda).toBeCloseTo(180, 12);
    expect(spherical.beta).toBeCloseTo(0, 12);
    expect(spherical.delta).toBeCloseTo(1, 12);
  });

  it("converts unit vector on -Y axis (lambda=270°, beta=0°, r=1)", () => {
    const rectangular = new EclipticRectangularCoordinates(0, -1, 0, Sun);
    const spherical =
      CoordinatesConverter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
        rectangular,
      );
    expect(spherical.lambda).toBeCloseTo(270, 12);
    expect(spherical.beta).toBeCloseTo(0, 12);
    expect(spherical.delta).toBeCloseTo(1, 12);
  });

  it("computes latitude from z component correctly (beta=asin(z/r))", () => {
    // 3-4-5 triangle with z=3, in XY plane radius 4 (x=4, y=0). r = 5
    const rectangular = new EclipticRectangularCoordinates(4, 0, 3, Sun);
    const spherical =
      CoordinatesConverter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
        rectangular,
      );
    expect(spherical.delta).toBeCloseTo(5, 12);
    // lambda should be 0 since y=0, x>0
    expect(spherical.lambda).toBeCloseTo(0, 12);
    // beta = asin(3/5) ≈ 36.86989765°
    expect(spherical.beta).toBeCloseTo(36.86989765, 8);
  });

  it("wraps negative longitude to [0, 360) degrees", () => {
    // atan2(y, x) with x>0, y<0 gives negative angle: -45°, should wrap to 315°
    const rectangular = new EclipticRectangularCoordinates(1, -1, 0, Sun);
    const spherical =
      CoordinatesConverter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
        rectangular,
      );
    expect(spherical.lambda).toBeCloseTo(315, 12);
    expect(spherical.beta).toBeCloseTo(0, 12);
  });

  it("preserves center object from input to output", () => {
    const customCenter = new SkyObject(SkyObjectType.PLANET, "Earth");
    const rectangular = new EclipticRectangularCoordinates(
      2,
      3,
      4,
      customCenter,
    );
    const spherical =
      CoordinatesConverter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
        rectangular,
      );
    expect(spherical.center).toStrictEqual(customCenter);
  });

  it("computes moon JD2000 ecliptic rectangular geocentric coordinates correctly", () => {
    const rectangular = new EclipticRectangularCoordinates(
      -0.0019492687154063215,
      0 - 0.0018381001466430957,
      0.000242474771167682,
      new SkyObject(SkyObjectType.PLANET, "Earth"),
    );

    const spherical =
      CoordinatesConverter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
        rectangular,
      );

    expect(spherical.lambda).toBeCloseTo(223.318711027314, 12);
    expect(spherical.beta).toBeCloseTo(5.1712800717147305, 12);
    expect(spherical.delta).toBeCloseTo(402444.81766106 / 149597870.7, 12);
    expect(spherical.center).toStrictEqual(
      new SkyObject(SkyObjectType.PLANET, "Earth"),
    );
  });
});

describe("CoordinatesConverter.eclipticSphericalCoordinatesToEquatorialSphericalCoordinates", () => {
  const obliquity = 23.44; // degrees

  it("with zero obliquity, RA=lambda and Dec=beta", () => {
    const center = Sun;
    const ecl = new EclipticSphericalCoordinates(123.456, -12.34, 2.5, center);
    const eq =
      CoordinatesConverter.eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(
        ecl,
        0,
      );
    expect(eq.rightAscension).toBeCloseTo(123.456, 10);
    expect(eq.declination).toBeCloseTo(-12.34, 10);
    expect(eq.delta).toBe(2.5);
    expect(eq.obliquity).toBeCloseTo(0, 12);
    expect(eq.center).toStrictEqual(center);
  });

  it("for lambda=0°, beta=0°, RA=0° and Dec=0° regardless of obliquity", () => {
    const ecl = new EclipticSphericalCoordinates(0, 0, 1, Sun);
    const eq =
      CoordinatesConverter.eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(
        ecl,
        obliquity,
      );
    expect(eq.rightAscension).toBeCloseTo(0, 12);
    expect(eq.declination).toBeCloseTo(0, 12);
    expect(eq.delta).toBe(1);
  });

  it("for lambda=90°, beta=0°, RA=90° and Dec≈obliquity", () => {
    const ecl = new EclipticSphericalCoordinates(90, 0, 1, Sun);
    const eq =
      CoordinatesConverter.eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(
        ecl,
        obliquity,
      );
    expect(eq.rightAscension).toBeCloseTo(90, 8);
    expect(eq.declination).toBeCloseTo(obliquity, 8);
    expect(eq.delta).toBe(1);
  });

  it("for lambda=270°, beta=0°, RA=270° and Dec≈-obliquity", () => {
    const ecl = new EclipticSphericalCoordinates(270, 0, 1, Sun);
    const eq =
      CoordinatesConverter.eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(
        ecl,
        obliquity,
      );
    expect(eq.rightAscension).toBeCloseTo(270, 8);
    expect(eq.declination).toBeCloseTo(-obliquity, 8);
    expect(eq.delta).toBe(1);
  });

  it("handles non-zero beta correctly (lambda=0°, beta=30°)", () => {
    const beta = 30; // degrees
    const ecl = new EclipticSphericalCoordinates(0, beta, 1, Sun);
    const eq =
      CoordinatesConverter.eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(
        ecl,
        obliquity,
      );

    expect(eq.declination).toBeCloseTo(27.3057396593, 8);
    expect(eq.rightAscension).toBeCloseTo(347.065558976, 8);
    expect(eq.delta).toBe(1);
  });

  it("preserves center and sets obliquity on result", () => {
    const center = new SkyObject(SkyObjectType.PLANET, "Mars");
    const eclipticSphericalCoordinates = new EclipticSphericalCoordinates(
      10,
      20,
      3.2,
      center,
    );
    const equatorialSphericalCoordinates =
      CoordinatesConverter.eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(
        eclipticSphericalCoordinates,
        obliquity,
      );
    expect(equatorialSphericalCoordinates.center).toStrictEqual(center);
    expect(equatorialSphericalCoordinates.obliquity).toBeCloseTo(obliquity, 12);
    expect(equatorialSphericalCoordinates.delta).toBe(3.2);
  });

  it("converts moon JD2000 ecliptic to equatorial spherical coordinates correctly", () => {
    const obliquity = 23.439291;
    const ecliptic = new EclipticSphericalCoordinates(
      223.318711027314,
      5.1712800717147305,
      402444.81766106 / 149597870.7,
      new SkyObject(SkyObjectType.PLANET, "Earth"),
    );
    const equatorial =
      CoordinatesConverter.eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(
        ecliptic,
        obliquity,
      );
    expect(equatorial.rightAscension).toBeCloseTo(222.44721566462408, 12);
    expect(equatorial.declination).toBeCloseTo(-10.89973314079676, 12);
    expect(equatorial.delta).toBeCloseTo(402444.81766106 / 149597870.7, 12);
    expect(equatorial.obliquity).toBeCloseTo(obliquity, 12);
    expect(equatorial.center).toStrictEqual(
      new SkyObject(SkyObjectType.PLANET, "Earth"),
    );
  });

  it("converts moon JD2000 equatorial to topocentric spherical coordinates correctly", () => {
    const equatorialSphericalCoordinates = new EquatorialSphericalCoordinates(
      222.44721566462408,
      -10.89973314079676,
      402444.81766106 / 149597870.7,
      23.439291,
      new Earth(),
    );
    const equatorialSphericalTopocentric =
      CoordinatesConverter.equatorialSphericalGeocentricToEquatorialSphericalTopocentric(
        equatorialSphericalCoordinates,
        Constants.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
        0,
        280.46061837,
      );

    expect(equatorialSphericalTopocentric.rightAscension).toBeCloseTo(
      221.95509118949212,
      12,
    );
    expect(equatorialSphericalTopocentric.declination).toBeCloseTo(
      -11.652512735856815,
      12,
    );
  });

  it("converts moon JD2000 topocentric to horizontal spherical coordinates correctly", () => {
    const topocentricEquatorialRightAscensionDeclinationCoordinates =
      new TopocentricEquatorialSphericalCoordinates(
        221.95509118949212,
        -11.652512735856815,
      );
    const horizontalSphericalCoordinates =
      CoordinatesConverter.topocentricEquatorialRightAscensionDeclinationToHorizontalCoordinates(
        topocentricEquatorialRightAscensionDeclinationCoordinates,
        Constants.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
        280.46061837,
      );

    expect(horizontalSphericalCoordinates.altitude).toBeCloseTo(
      9.244866798477615,
      12,
    );
    expect(horizontalSphericalCoordinates.azimuth).toBeCloseTo(
      237.79077582673483,
      12,
    );
  });
});
