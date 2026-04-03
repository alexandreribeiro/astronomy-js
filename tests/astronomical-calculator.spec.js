import { describe, it, expect } from "vitest";
import { Constants } from "../lib/constants.js";
import { Earth } from "../lib/solar-system-objects/planets/earth.js";
import { AstronomicalCalculator } from "../lib/astronomical-calculator.js";
import { SOLAR_SYSTEM_OBJECTS_LIST } from "../lib/solar-system-objects/solar-system-objects-list.js";
import { ObserverLocation } from "../lib/coordinates/types/observer-location.js";

describe("AstronomicalCalculator.getHorizontalSphericalCoordinatesForSolarSystemObject", () => {
  it("gets JD2000 horizontalSphericalCoordinates for moon for a Greenwich observer", () => {
    const observerSphericalCoordinates = new ObserverLocation(
      Constants.GREENWICH_OBSERVATORY_COORDINATES.LONGITUDE,
      Constants.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
      Constants.GREENWICH_OBSERVATORY_COORDINATES.ELEVATION,
      new Earth(),
    );

    const moon = SOLAR_SYSTEM_OBJECTS_LIST.find((o) => o.name === "Moon");

    const horizontalSphericalCoordinates = new AstronomicalCalculator(
      observerSphericalCoordinates,
      new Earth(),
    ).getHorizontalSphericalCoordinatesForSolarSystemObject(
      observerSphericalCoordinates,
      moon,
      Constants.JULIAN_DAY_2000,
    );

    expect(horizontalSphericalCoordinates.altitude).toBeCloseTo(
      9.245124410383623,
      10,
    );
    expect(horizontalSphericalCoordinates.azimuth).toBeCloseTo(
      237.79035492494748,
      10,
    );
  });
});
