import { AngleCalculator } from "../lib/angle-calculator.js";

describe("AngleCalculator", function () {
  describe("modDegrees", () => {
    it("should return the same value for degrees in [0, 360)", () => {
      expect(AngleCalculator.modDegrees(0)).toBe(0);
      expect(AngleCalculator.modDegrees(180)).toBe(180);
      expect(AngleCalculator.modDegrees(359.9)).toBe(359.9);
    });

    it("should wrap values greater than 360", () => {
      expect(AngleCalculator.modDegrees(360)).toBe(0);
      expect(AngleCalculator.modDegrees(370)).toBe(10);
      expect(AngleCalculator.modDegrees(720)).toBe(0);
      expect(AngleCalculator.modDegrees(730)).toBe(10);
    });

    it("should wrap negative values", () => {
      expect(AngleCalculator.modDegrees(-10)).toBe(350);
      expect(AngleCalculator.modDegrees(-360)).toBe(0);
      expect(AngleCalculator.modDegrees(-370)).toBe(350);
    });
  });

  describe("mod180Degrees", () => {
    it("should return the same value for degrees in [0, 180]", () => {
      expect(AngleCalculator.mod180Degrees(0)).toBe(0);
      expect(AngleCalculator.mod180Degrees(90)).toBe(90);
      expect(AngleCalculator.mod180Degrees(180)).toBe(180);
    });

    it("should return negative values for degrees in (180, 360)", () => {
      expect(AngleCalculator.mod180Degrees(181)).toBe(-179);
      expect(AngleCalculator.mod180Degrees(270)).toBe(-90);
      expect(AngleCalculator.mod180Degrees(359)).toBe(-1);
    });

    it("should handle values outside [0, 360)", () => {
      expect(AngleCalculator.mod180Degrees(370)).toBe(10);
      expect(AngleCalculator.mod180Degrees(-10)).toBe(-10);
      expect(AngleCalculator.mod180Degrees(-190)).toBe(170);
    });
  });

  describe("modRadians", () => {
    const TWO_PI = 2 * Math.PI;

    it("should return the same value for radians in [0, 2π)", () => {
      expect(AngleCalculator.modRadians(0)).toBe(0);
      expect(AngleCalculator.modRadians(Math.PI)).toBe(Math.PI);
      expect(AngleCalculator.modRadians(TWO_PI - 0.1)).toBeCloseTo(
        TWO_PI - 0.1,
        10,
      );
    });

    it("should wrap values greater than 2π", () => {
      expect(AngleCalculator.modRadians(TWO_PI)).toBe(0);
      expect(AngleCalculator.modRadians(TWO_PI + 1)).toBeCloseTo(1, 10);
      expect(AngleCalculator.modRadians(2 * TWO_PI + 1)).toBeCloseTo(1, 10);
    });

    it("should wrap negative values", () => {
      expect(AngleCalculator.modRadians(-1)).toBeCloseTo(TWO_PI - 1, 10);
      expect(AngleCalculator.modRadians(-TWO_PI)).toBe(0);
      expect(AngleCalculator.modRadians(-TWO_PI - 1)).toBeCloseTo(
        TWO_PI - 1,
        10,
      );
    });
  });

  describe("modPiRadians", () => {
    it("should return the same value for radians in [0, π]", () => {
      expect(AngleCalculator.modPiRadians(0)).toBe(0);
      expect(AngleCalculator.modPiRadians(Math.PI / 2)).toBe(Math.PI / 2);
      expect(AngleCalculator.modPiRadians(Math.PI)).toBe(Math.PI);
    });

    it("should return negative values for radians in (π, 2π)", () => {
      expect(AngleCalculator.modPiRadians(Math.PI + 0.1)).toBeCloseTo(
        0.1 - Math.PI,
        10,
      );
      expect(AngleCalculator.modPiRadians(1.5 * Math.PI)).toBeCloseTo(
        -0.5 * Math.PI,
        10,
      );
    });

    it("should handle values outside [0, 2π)", () => {
      expect(AngleCalculator.modPiRadians(2 * Math.PI + 0.1)).toBeCloseTo(
        0.1,
        10,
      );
      expect(AngleCalculator.modPiRadians(-0.1)).toBeCloseTo(-0.1, 10);
    });
  });

  describe("conversions", () => {
    it("should convert radians to degrees correctly", () => {
      expect(AngleCalculator.radiansToDegrees(0)).toBe(0);
      expect(AngleCalculator.radiansToDegrees(Math.PI)).toBe(180);
      expect(AngleCalculator.radiansToDegrees(2 * Math.PI)).toBe(360);
      expect(AngleCalculator.radiansToDegrees(Math.PI / 2)).toBe(90);
    });

    it("should convert degrees to radians correctly", () => {
      expect(AngleCalculator.degreesToRadians(0)).toBe(0);
      expect(AngleCalculator.degreesToRadians(180)).toBe(Math.PI);
      expect(AngleCalculator.degreesToRadians(360)).toBe(2 * Math.PI);
      expect(AngleCalculator.degreesToRadians(90)).toBe(Math.PI / 2);
    });
  });
});
