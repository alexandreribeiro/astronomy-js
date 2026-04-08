import { initialize } from "../index.js";
import { Constants } from "../lib/constants.js";

describe("AstronomyEngine", function () {
  const EPOCH_2000_DATE = Date.UTC(2000, 0, 1, 12);
  let astronomyEngine;
  beforeEach(function () {
    astronomyEngine = initialize();
    astronomyEngine.setLocation(
      "Earth",
      Constants.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
      Constants.GREENWICH_OBSERVATORY_COORDINATES.LONGITUDE,
      Constants.GREENWICH_OBSERVATORY_COORDINATES.ELEVATION,
    );
    astronomyEngine.setDate(EPOCH_2000_DATE);
  });

  it("should get sky object by name", function () {
    expect(astronomyEngine.getSkyObjectByName("Sun").name).toBe("Sun");
  });

  it("should get no sky object", function () {
    expect(astronomyEngine.getSkyObjectByName("")).toBeNull();
  });

  it("should set and get date", function () {
    astronomyEngine.setDate(EPOCH_2000_DATE + 10);
    expect(astronomyEngine.getDate()).toBe(EPOCH_2000_DATE + 10);
  });

  it("should get local sidereal time for Greenwich in epoch J2000", function () {
    expect(astronomyEngine.getLocalMeanSiderealTime()).toBeCloseTo(
      280.46011837,
      6,
    );
  });

  it("should get local sidereal time for a custom date argument", function () {
    expect(
      astronomyEngine.getLocalMeanSiderealTime(EPOCH_2000_DATE),
    ).toBeCloseTo(280.46011837, 6);
  });

  it("should adjust local sidereal time based on longitude", function () {
    astronomyEngine.setLocation("Earth", 51.4769, 15, 0);
    expect(astronomyEngine.getLocalMeanSiderealTime()).toBeCloseTo(295.46, 2);
  });

  it("should set observer location", function () {
    astronomyEngine.setLocation("Mars", 0, 0, 0);
    expect(astronomyEngine.observerLocation.center.name).toBe("Mars");
    expect(astronomyEngine.observerLocation.latitude).toBe(0);
    expect(astronomyEngine.observerLocation.longitude).toBe(0);
  });

  it("should get observer location", function () {
    astronomyEngine.setLocation("Mars", 10, 20, 0);
    let coordinates = astronomyEngine.getLatitudeLongitudeCoordinates();
    expect(coordinates.latitude).toBe(10);
    expect(coordinates.longitude).toBe(20);
  });

  it("should get right ascension and declination for sun in epoch J2000", function () {
    const raDec =
      astronomyEngine.getRightAscensionDeclinationCoordinatesForObject("Sun");
    expect(raDec.declination).toBeCloseTo(-23.035, 2);
    expect(raDec.rightAscension).toBeCloseTo(281.29, 2);
  });

  it("should get local hour angle and declination for sun in epoch J2000", function () {
    const haDec =
      astronomyEngine.getHourAngleDeclinationCoordinatesForObject("Sun");
    expect(haDec.declination).toBeCloseTo(-23.035, 2);
    expect(haDec.hourAngle).toBeCloseTo(359.17, 2);
  });

  it("should get altitude and azimuth for sun in epoch J2000", function () {
    let altAz = astronomyEngine.getAltitudeAzimuthCoordinatesForObject("Sun");
    expect(altAz.altitude).toBeCloseTo(15.48, 2);
    expect(altAz.azimuth).toBeCloseTo(179.21, 2);

    altAz = astronomyEngine.getAltitudeAzimuthCoordinatesForObject(
      "Sun",
      EPOCH_2000_DATE,
    );
    expect(altAz.altitude).toBeCloseTo(15.48, 2);
    expect(altAz.azimuth).toBeCloseTo(179.21, 2);
  });

  it("should get ephemeris for sun rise", function () {
    expect(
      astronomyEngine
        .getEphemerisDateForObject("Sun", EPOCH_2000_DATE, "SUNRISE")
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 08:05");
  });
});
