import { describe, it, expect } from "vitest";
import { Constants } from "../lib/constants.js";
import { Earth } from "../lib/solar-system-objects/planets/earth.js";
import { AstronomicalCalculator } from "../lib/astronomical-calculator.js";
import { ObserverLocation } from "../lib/coordinates/types/observer-location.js";
import { Moon } from "../lib/solar-system-objects/satellites/moon.js";
import { Mars } from "../lib/solar-system-objects/planets/mars.js";
import { Sun } from "../lib/solar-system-objects/sun.js";

describe("AstronomicalCalculator", () => {
  const mars = new Mars();
  const sun = new Sun();
  const moon = new Moon();

  const greenwichObserver = new ObserverLocation(
    Constants.GREENWICH_OBSERVATORY_COORDINATES.LONGITUDE,
    Constants.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
    Constants.GREENWICH_OBSERVATORY_COORDINATES.ELEVATION,
    new Earth(),
  );

  const kirunaObserver = new ObserverLocation(
    Constants.KIRUNA_COORDINATES.LONGITUDE,
    Constants.KIRUNA_COORDINATES.LATITUDE,
    Constants.KIRUNA_COORDINATES.ELEVATION,
    new Earth(),
  );

  it("gets JD2000 horizontalSphericalCoordinates for moon for a Greenwich observer", () => {
    const horizontalSphericalCoordinates =
      AstronomicalCalculator.getHorizontalSphericalCoordinatesForSolarSystemObject(
        greenwichObserver,
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

  it("should calculate local sidereal time in epoch day zero correctly", function () {
    expect(
      AstronomicalCalculator.getLocalMeanSiderealTime(
        greenwichObserver,
        Constants.JULIAN_DAY_2000,
      ),
    ).toBeCloseTo(280.4601, 4);
  });

  it("should calculate distance to solar system objects in epoch day zero correctly", function () {
    expect(
      AstronomicalCalculator.getDistanceToSolarSystemObject(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000,
      ),
    ).toBeCloseTo(0.983, 3);
    expect(
      AstronomicalCalculator.getDistanceToSolarSystemObject(
        greenwichObserver,
        mars,
        Constants.JULIAN_DAY_2000,
      ),
    ).toBeCloseTo(1.849, 3);
  });

  it("should calculate distance to solar system objects in epoch day zero plus one decade correctly", function () {
    expect(
      AstronomicalCalculator.getDistanceToSolarSystemObject(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2010,
      ),
    ).toBeCloseTo(0.983, 3);
    expect(
      AstronomicalCalculator.getDistanceToSolarSystemObject(
        greenwichObserver,
        mars,
        Constants.JULIAN_DAY_2010,
      ),
    ).toBeCloseTo(0.739, 3);
  });

  it("should calculate RA/Dec to solar system objects in epoch day zero correctly", function () {
    const RADecForSun =
      AstronomicalCalculator.getRADecCoordinatesForSolarSystemObject(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000,
      );
    expect(RADecForSun.latitude).toBeCloseTo(-23.03, 2);
    expect(RADecForSun.longitude).toBeCloseTo(281.29, 2);

    const RADecForMoon =
      AstronomicalCalculator.getRADecCoordinatesForSolarSystemObject(
        greenwichObserver,
        moon,
        Constants.JULIAN_DAY_2000,
      );
    expect(RADecForMoon.latitude).toBeCloseTo(-10.9, 1);
    expect(RADecForMoon.longitude).toBeCloseTo(222.45, 1);

    const RADecForMars =
      AstronomicalCalculator.getRADecCoordinatesForSolarSystemObject(
        greenwichObserver,
        mars,
        Constants.JULIAN_DAY_2000,
      );
    expect(RADecForMars.latitude).toBeCloseTo(-13.18, 2);
    expect(RADecForMars.longitude).toBeCloseTo(330.54, 2);
  });

  it("should calculate RA/Dec to solar system objects in epoch day zero plus one decade correctly", function () {
    const RADecForSun =
      AstronomicalCalculator.getRADecCoordinatesForSolarSystemObject(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2010,
      );
    expect(RADecForSun.latitude).toBeCloseTo(-23.04, 2);
    expect(RADecForSun.longitude).toBeCloseTo(281.22, 2);

    const RADecForMars =
      AstronomicalCalculator.getRADecCoordinatesForSolarSystemObject(
        greenwichObserver,
        mars,
        Constants.JULIAN_DAY_2010,
      );
    expect(RADecForMars.latitude).toBeCloseTo(18.79, 2);
    expect(RADecForMars.longitude).toBeCloseTo(142.35, 2);
  });

  it("should calculate HA/Dec to solar system objects in epoch day zero correctly", function () {
    const HADecForSun =
      AstronomicalCalculator.getHADecCoordinatesForSolarSystemObject(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000,
      );
    expect(HADecForSun.latitude).toBeCloseTo(-23.03, 2);
    expect(HADecForSun.longitude).toBeCloseTo(359.17, 2);

    const HADecForMars =
      AstronomicalCalculator.getHADecCoordinatesForSolarSystemObject(
        greenwichObserver,
        mars,
        Constants.JULIAN_DAY_2000,
      );
    expect(HADecForMars.latitude).toBeCloseTo(-13.18, 2);
    expect(HADecForMars.longitude).toBeCloseTo(309.92, 2);
  });

  it("should calculate HA/Dec to solar system objects in epoch day zero plus one decade correctly", function () {
    const HADecForSun =
      AstronomicalCalculator.getHADecCoordinatesForSolarSystemObject(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2010,
      );
    expect(HADecForSun.latitude).toBeCloseTo(-23.04, 2);
    expect(HADecForSun.longitude).toBeCloseTo(179.32, 2);

    const HADecForMars =
      AstronomicalCalculator.getHADecCoordinatesForSolarSystemObject(
        greenwichObserver,
        mars,
        Constants.JULIAN_DAY_2010,
      );
    expect(HADecForMars.latitude).toBeCloseTo(18.79, 2);
    expect(HADecForMars.longitude).toBeCloseTo(318.19, 2);
  });

  it("should calculate Alt/Az to solar system objects in epoch day zero correctly", function () {
    const RADecForSun =
      AstronomicalCalculator.getRADecCoordinatesForSolarSystemObject(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000,
      );
    const AltAzForSun =
      AstronomicalCalculator.getAltAzCoordinatesForEquatorialCoordinates(
        greenwichObserver,
        RADecForSun,
        Constants.JULIAN_DAY_2000,
      );
    expect(AltAzForSun.latitude).toBeCloseTo(15.49, 2);
    expect(AltAzForSun.longitude).toBeCloseTo(179.21, 2);

    const RADecForMoon =
      AstronomicalCalculator.getRADecCoordinatesForSolarSystemObject(
        greenwichObserver,
        moon,
        Constants.JULIAN_DAY_2000,
      );
    const AltAzForMoon =
      AstronomicalCalculator.getAltAzCoordinatesForEquatorialCoordinates(
        greenwichObserver,
        RADecForMoon,
        Constants.JULIAN_DAY_2000,
      );
    expect(AltAzForMoon.latitude).toBeCloseTo(10.14, 1);
    expect(AltAzForMoon.longitude).toBeCloseTo(237.79, 1);

    const RADecForMars =
      AstronomicalCalculator.getRADecCoordinatesForSolarSystemObject(
        greenwichObserver,
        mars,
        Constants.JULIAN_DAY_2000,
      );
    const AltAzForMars =
      AstronomicalCalculator.getAltAzCoordinatesForEquatorialCoordinates(
        greenwichObserver,
        RADecForMars,
        Constants.JULIAN_DAY_2000,
      );
    expect(AltAzForMars.latitude).toBeCloseTo(12.17, 2);
    expect(AltAzForMars.longitude).toBeCloseTo(130.19, 2);
  });

  it("should calculate transit times correctly", function () {
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000 - 0.25,
        Constants.EPHEMERIS_TYPE.TRANSIT,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 12:03");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000,
        Constants.EPHEMERIS_TYPE.TRANSIT,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 12:03");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000 + 0.25,
        Constants.EPHEMERIS_TYPE.TRANSIT,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 12:03");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000 + 0.5,
        Constants.EPHEMERIS_TYPE.TRANSIT,
      ).toUTCString(),
    ).toContain("Sun, 02 Jan 2000 12:03");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        mars,
        Constants.JULIAN_DAY_2000 + 0.25,
        Constants.EPHEMERIS_TYPE.TRANSIT,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 15:20");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        kirunaObserver,
        sun,
        Constants.JULIAN_DAY_2000,
        Constants.EPHEMERIS_TYPE.TRANSIT,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 10:42");
  });

  it("should calculate lower transit times correctly", function () {
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000 - 0.25,
        Constants.EPHEMERIS_TYPE.LOWER_TRANSIT,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 00:03");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000,
        Constants.EPHEMERIS_TYPE.LOWER_TRANSIT,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 00:03");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000 + 0.25,
        Constants.EPHEMERIS_TYPE.LOWER_TRANSIT,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 00:03");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000 + 0.5,
        Constants.EPHEMERIS_TYPE.LOWER_TRANSIT,
      ).toUTCString(),
    ).toContain("Sun, 02 Jan 2000 00:03");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        mars,
        Constants.JULIAN_DAY_2000 + 0.25,
        Constants.EPHEMERIS_TYPE.LOWER_TRANSIT,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 03:20");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        kirunaObserver,
        sun,
        Constants.JULIAN_DAY_2000,
        Constants.EPHEMERIS_TYPE.LOWER_TRANSIT,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 22:42");
  });

  it("should calculate rise times correctly", function () {
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000 - 0.25,
        Constants.EPHEMERIS_TYPE.SUNRISE,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 08:05");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000,
        Constants.EPHEMERIS_TYPE.SUNRISE,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 08:05");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000 + 0.25,
        Constants.EPHEMERIS_TYPE.SUNRISE,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 08:05");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000 + 0.5,
        Constants.EPHEMERIS_TYPE.SUNRISE,
      ).toUTCString(),
    ).toContain("Sun, 02 Jan 2000 08:05");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        mars,
        Constants.JULIAN_DAY_2000 + 0.25,
        Constants.EPHEMERIS_TYPE.RISE,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 10:28");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        kirunaObserver,
        sun,
        Constants.JULIAN_DAY_2000,
        Constants.EPHEMERIS_TYPE.SUNRISE,
      ),
    ).toBeNull();
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        kirunaObserver,
        sun,
        Constants.JULIAN_DAY_2000 + 30,
        Constants.EPHEMERIS_TYPE.SUNRISE,
      ).toUTCString(),
    ).toContain("Mon, 31 Jan 2000 08:02");
  });

  it("should calculate set times correctly", function () {
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000 - 0.25,
        Constants.EPHEMERIS_TYPE.SUNSET,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 16:01");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000,
        Constants.EPHEMERIS_TYPE.SUNSET,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 16:01");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000 + 0.25,
        Constants.EPHEMERIS_TYPE.SUNSET,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 16:01");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        sun,
        Constants.JULIAN_DAY_2000 + 0.5,
        Constants.EPHEMERIS_TYPE.SUNSET,
      ).toUTCString(),
    ).toContain("Sun, 02 Jan 2000 16:02");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        greenwichObserver,
        mars,
        Constants.JULIAN_DAY_2000 + 0.25,
        Constants.EPHEMERIS_TYPE.SET,
      ).toUTCString(),
    ).toContain("Sat, 01 Jan 2000 20:12");
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        kirunaObserver,
        sun,
        Constants.JULIAN_DAY_2000,
        Constants.EPHEMERIS_TYPE.SUNSET,
      ),
    ).toBeNull();
    expect(
      AstronomicalCalculator.getDateForPositionalEphemeris(
        kirunaObserver,
        sun,
        Constants.JULIAN_DAY_2000 + 30,
        Constants.EPHEMERIS_TYPE.SUNSET,
      ).toUTCString(),
    ).toContain("Mon, 31 Jan 2000 13:44");
  });
});
