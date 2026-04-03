import { initialize } from "../index.js";
import { Constants } from "../lib/constants";

describe("AstronomyEngine", function () {
  const EPOCH_2000_DATE = Date.UTC(2000, 0, 1, 12);
  let observer;
  beforeEach(function () {
    observer = initialize();
    observer.setLocation(
      "Earth",
      Constants.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
      Constants.GREENWICH_OBSERVATORY_COORDINATES.LONGITUDE,
      Constants.GREENWICH_OBSERVATORY_COORDINATES.RADIUS,
    );
    observer.setDate(EPOCH_2000_DATE);
  });

  it("should get sky object by name", function () {
    expect(observer.getSkyObjectByName("Sun").name).toBe("Sun");
  });

  it("should get no sky object", function () {
    expect(observer.getSkyObjectByName("")).toBeNull();
  });

  it("should set and get date", function () {
    observer.setDate(EPOCH_2000_DATE + 10);
    expect(observer.getDate()).toBe(EPOCH_2000_DATE + 10);
  });

  it("should get local sidereal time for Greenwich in epoch J2000", function () {
    expect(observer.getLocalMeanSiderealTime()).toBeCloseTo(280.46011837, 6);
  });

  it("should get local sidereal time for a custom date argument", function () {
    expect(observer.getLocalMeanSiderealTime(EPOCH_2000_DATE)).toBeCloseTo(
      280.46011837,
      6,
    );
  });

  it("should adjust local sidereal time based on longitude", function () {
    observer.setLocation("Earth", 51.4769, 15, 0);
    expect(observer.getLocalMeanSiderealTime()).toBeCloseTo(295.46, 2);
  });

  it("should set observer location", function () {
    observer.setLocation("Mars", 0, 0, 0);
    let astronomicalCalculator = observer.astronomicalCalculator;
    expect(astronomicalCalculator.solarSystemObject.name).toBe("Mars");
    expect(astronomicalCalculator.observerLocation.latitude).toBe(0);
    expect(astronomicalCalculator.observerLocation.longitude).toBe(0);
  });

  it("should get observer location", function () {
    observer.setLocation("Mars", 10, 20, 0);
    let coordinates = observer.getLatitudeLongitudeCoordinates();
    expect(coordinates.latitude).toBe(10);
    expect(coordinates.longitude).toBe(20);
  });

  it("should get right ascension and declination for sun in epoch J2000", function () {
    const raDec = observer.getRADecCoordinatesForObject("Sun");
    expect(raDec.latitude).toBeCloseTo(-23.03, 2);
    expect(raDec.longitude).toBeCloseTo(281.29, 2);
  });

  it("should get local hour angle and declination for sun in epoch J2000", function () {
    const haDec = observer.getHADecCoordinatesForObject("Sun");
    expect(haDec.latitude).toBeCloseTo(-23.03, 2);
    expect(haDec.longitude).toBeCloseTo(359.17, 2);
  });

  it("should get altitude and azimuth for sun in epoch J2000", function () {
    let altAz = observer.getAltAzCoordinatesForObject("Sun");
    expect(altAz.latitude).toBeCloseTo(15.49, 2);
    expect(altAz.longitude).toBeCloseTo(179.21, 2);

    altAz = observer.getAltAzCoordinatesForObject("Sun", EPOCH_2000_DATE);
    expect(altAz.latitude).toBeCloseTo(15.49, 2);
    expect(altAz.longitude).toBeCloseTo(179.21, 2);
  });

  it("should get ephemeris for sun rise", function () {
    expect(
      observer
        .getEphemerisDateForObject("Sun", EPOCH_2000_DATE, "SUNRISE")
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 08:05");
  });
});
