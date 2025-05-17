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
      0,
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
  it("should set observer location", function () {
    observer.setLocation("Mars", 0, 0, 0);
    let astronomicalCalculator = observer.astronomicalCalculator;
    expect(astronomicalCalculator.solarSystemObject.name).toBe("Mars");
    expect(astronomicalCalculator.sphericalCoordinates.latitude).toBe(0);
    expect(astronomicalCalculator.sphericalCoordinates.longitude).toBe(0);
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
        .getEphemerisDateForObject("Sun", EPOCH_2000_DATE, "RISE")
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 08:05");
  });
});
