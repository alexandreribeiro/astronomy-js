import { SphericalCoordinates } from "../../lib/coordinates/spherical-coordinates";

describe("SphericalCoordinates", function () {
  it("should convert to positive degrees", function () {
    const sphericalCoordinatesInDegrees = new SphericalCoordinates(
      15.51,
      30.51,
      0,
    ).toDegrees();
    expect(sphericalCoordinatesInDegrees.latitude).toBe("15\u00B0 30' 36''");
    expect(sphericalCoordinatesInDegrees.longitude).toBe("30\u00B0 30' 36''");
  });
  it("should convert to negative degrees", function () {
    const sphericalCoordinatesInDegrees = new SphericalCoordinates(
      -30.51,
      -15.51,
      0,
    ).toDegrees();
    expect(sphericalCoordinatesInDegrees.latitude).toBe("-30\u00B0 30' 36''");
    expect(sphericalCoordinatesInDegrees.longitude).toBe("-15\u00B0 30' 36''");
  });
  it("should convert to positive hours", function () {
    const sphericalCoordinatesInDegrees = new SphericalCoordinates(
      15.51,
      39.301,
      0,
    ).toHours();
    expect(sphericalCoordinatesInDegrees.latitude).toBe("15\u00B0 30' 36''");
    expect(sphericalCoordinatesInDegrees.longitude).toBe("02h 37m 12s");
  });
  it("should convert to negative hours", function () {
    const sphericalCoordinatesInDegrees = new SphericalCoordinates(
      -30.51,
      -39.301,
      0,
    ).toHours();
    expect(sphericalCoordinatesInDegrees.latitude).toBe("-30\u00B0 30' 36''");
    expect(sphericalCoordinatesInDegrees.longitude).toBe("-02h 37m 12s");
  });
});
