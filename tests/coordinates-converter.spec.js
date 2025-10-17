import { describe, it, expect } from "vitest";
import { CoordinatesConverter } from "../lib/coordinates-converter.js";
import { EclipticRectangularCoordinates } from "../lib/coordinates/ecliptic-rectangular-coordinates.js";
import { SkyObject } from "../lib/sky-object.js";
import { SkyObjectType } from "../lib/sky-object-type.js";

const Sun = new SkyObject(SkyObjectType.STAR, "Sun");

describe("CoordinatesConverter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates", () => {
  const converter = new CoordinatesConverter();

  it("converts unit vector on +X axis (lambda=0°, beta=0°, r=1)", () => {
    const rectangular = new EclipticRectangularCoordinates(1, 0, 0, Sun);
    const spherical =
      converter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
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
      converter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
        rectangular,
      );
    expect(spherical.lambda).toBeCloseTo(90, 12);
    expect(spherical.beta).toBeCloseTo(0, 12);
    expect(spherical.delta).toBeCloseTo(1, 12);
  });

  it("converts unit vector on -X axis (lambda=180°, beta=0°, r=1)", () => {
    const rectangular = new EclipticRectangularCoordinates(-1, 0, 0, Sun);
    const spherical =
      converter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
        rectangular,
      );
    expect(spherical.lambda).toBeCloseTo(180, 12);
    expect(spherical.beta).toBeCloseTo(0, 12);
    expect(spherical.delta).toBeCloseTo(1, 12);
  });

  it("converts unit vector on -Y axis (lambda=270°, beta=0°, r=1)", () => {
    const rectangular = new EclipticRectangularCoordinates(0, -1, 0, Sun);
    const spherical =
      converter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
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
      converter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
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
      converter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
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
      converter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
        rectangular,
      );
    expect(spherical.center).toStrictEqual(customCenter);
  });
});
