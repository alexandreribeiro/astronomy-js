import { Earth } from "../lib/solar-system-objects/planets/earth";
import { Mars } from "../lib/solar-system-objects/planets/mars";
import { Sun } from "../lib/solar-system-objects/sun";
import { SphericalCoordinates } from "../lib/coordinates/spherical-coordinates";
import { AstronomicalCalculator } from "../lib/astronomical-calculator.js";
import { Constants } from "../lib/constants";

describe("Observer", function () {
  const earth = new Earth();
  const mars = new Mars();
  const sun = new Sun();
  const greenwichObserver = new AstronomicalCalculator(
    new SphericalCoordinates(
      Constants.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
      Constants.GREENWICH_OBSERVATORY_COORDINATES.LONGITUDE,
      Constants.GREENWICH_OBSERVATORY_COORDINATES.RADIUS,
    ),
    earth,
  );

  const kirunaObserver = new AstronomicalCalculator(
    new SphericalCoordinates(67.85, 20.21, Constants.KIRUNA_COORDINATES.RADIUS),
    earth,
  );

  it("should calculate local sidereal time in epoch day zero correctly", function () {
    expect(
      greenwichObserver.getLocalSiderealTime(Constants.JULIAN_DAY_2000),
    ).toBeCloseTo(280.4601, 4);
  });

  it("should calculate distance to solar system objects in epoch day zero correctly", function () {
    expect(
      greenwichObserver.getDistanceToSolarSystemObject(
        sun,
        Constants.JULIAN_DAY_2000,
      ),
    ).toBeCloseTo(0.983, 3);
    expect(
      greenwichObserver.getDistanceToSolarSystemObject(
        mars,
        Constants.JULIAN_DAY_2000,
      ),
    ).toBeCloseTo(1.849, 3);
  });

  it("should calculate distance to solar system objects in epoch day zero plus one decade correctly", function () {
    expect(
      greenwichObserver.getDistanceToSolarSystemObject(
        sun,
        Constants.JULIAN_DAY_2010,
      ),
    ).toBeCloseTo(0.983, 3);
    expect(
      greenwichObserver.getDistanceToSolarSystemObject(
        mars,
        Constants.JULIAN_DAY_2010,
      ),
    ).toBeCloseTo(0.739, 3);
  });

  it("should calculate RA/Dec to solar system objects in epoch day zero correctly", function () {
    const RADecForSun =
      greenwichObserver.getRADecCoordinatesForSolarSystemObject(
        sun,
        Constants.JULIAN_DAY_2000,
      );
    expect(RADecForSun.latitude).toBeCloseTo(-23.03, 2);
    expect(RADecForSun.longitude).toBeCloseTo(281.29, 2);

    const RADecForMars =
      greenwichObserver.getRADecCoordinatesForSolarSystemObject(
        mars,
        Constants.JULIAN_DAY_2000,
      );
    expect(RADecForMars.latitude).toBeCloseTo(-13.18, 2);
    expect(RADecForMars.longitude).toBeCloseTo(330.54, 2);
  });

  it("should calculate RA/Dec to solar system objects in epoch day zero plus one decade correctly", function () {
    const RADecForSun =
      greenwichObserver.getRADecCoordinatesForSolarSystemObject(
        sun,
        Constants.JULIAN_DAY_2010,
      );
    expect(RADecForSun.latitude).toBeCloseTo(-23.04, 2);
    expect(RADecForSun.longitude).toBeCloseTo(281.22, 2);

    const RADecForMars =
      greenwichObserver.getRADecCoordinatesForSolarSystemObject(
        mars,
        Constants.JULIAN_DAY_2010,
      );
    expect(RADecForMars.latitude).toBeCloseTo(18.79, 2);
    expect(RADecForMars.longitude).toBeCloseTo(142.35, 2);
  });

  it("should calculate HA/Dec to solar system objects in epoch day zero correctly", function () {
    const HADecForSun =
      greenwichObserver.getHADecCoordinatesForSolarSystemObject(
        sun,
        Constants.JULIAN_DAY_2000,
      );
    expect(HADecForSun.latitude).toBeCloseTo(-23.03, 2);
    expect(HADecForSun.longitude).toBeCloseTo(359.17, 2);

    const HADecForMars =
      greenwichObserver.getHADecCoordinatesForSolarSystemObject(
        mars,
        Constants.JULIAN_DAY_2000,
      );
    expect(HADecForMars.latitude).toBeCloseTo(-13.18, 2);
    expect(HADecForMars.longitude).toBeCloseTo(309.92, 2);
  });

  it("should calculate HA/Dec to solar system objects in epoch day zero plus one decade correctly", function () {
    const HADecForSun =
      greenwichObserver.getHADecCoordinatesForSolarSystemObject(
        sun,
        Constants.JULIAN_DAY_2010,
      );
    expect(HADecForSun.latitude).toBeCloseTo(-23.04, 2);
    expect(HADecForSun.longitude).toBeCloseTo(179.32, 2);

    const HADecForMars =
      greenwichObserver.getHADecCoordinatesForSolarSystemObject(
        mars,
        Constants.JULIAN_DAY_2010,
      );
    expect(HADecForMars.latitude).toBeCloseTo(18.79, 2);
    expect(HADecForMars.longitude).toBeCloseTo(318.19, 2);
  });

  it("should calculate Alt/Az to solar system objects in epoch day zero correctly", function () {
    const RADecForSun =
      greenwichObserver.getRADecCoordinatesForSolarSystemObject(
        sun,
        Constants.JULIAN_DAY_2000,
      );
    const AltAzForSun =
      greenwichObserver.getAltAzCoordinatesForEquatorialCoordinates(
        RADecForSun,
        Constants.JULIAN_DAY_2000,
      );
    expect(AltAzForSun.latitude).toBeCloseTo(15.49, 2);
    expect(AltAzForSun.longitude).toBeCloseTo(179.21, 2);

    const RADecForMars =
      greenwichObserver.getRADecCoordinatesForSolarSystemObject(
        mars,
        Constants.JULIAN_DAY_2000,
      );
    const AltAzForMars =
      greenwichObserver.getAltAzCoordinatesForEquatorialCoordinates(
        RADecForMars,
        Constants.JULIAN_DAY_2000,
      );
    expect(AltAzForMars.latitude).toBeCloseTo(12.17, 2);
    expect(AltAzForMars.longitude).toBeCloseTo(130.19, 2);
  });

  it("should calculate transit times correctly", function () {
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 - 0.25,
          Constants.EPHEMERIS_TYPE.TRANSIT,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 12:03");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000,
          Constants.EPHEMERIS_TYPE.TRANSIT,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 12:03");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 + 0.25,
          Constants.EPHEMERIS_TYPE.TRANSIT,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 12:03");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 + 0.5,
          Constants.EPHEMERIS_TYPE.TRANSIT,
        )
        .toUTCString(),
    ).toContain("Sun, 02 Jan 2000 12:03");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          mars,
          Constants.JULIAN_DAY_2000 + 0.25,
          Constants.EPHEMERIS_TYPE.TRANSIT,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 15:20");
    expect(
      kirunaObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000,
          Constants.EPHEMERIS_TYPE.TRANSIT,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 10:42");
  });

  it("should calculate lower transit times correctly", function () {
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 - 0.25,
          Constants.EPHEMERIS_TYPE.LOWER_TRANSIT,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 00:03");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000,
          Constants.EPHEMERIS_TYPE.LOWER_TRANSIT,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 00:03");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 + 0.25,
          Constants.EPHEMERIS_TYPE.LOWER_TRANSIT,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 00:03");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 + 0.5,
          Constants.EPHEMERIS_TYPE.LOWER_TRANSIT,
        )
        .toUTCString(),
    ).toContain("Sun, 02 Jan 2000 00:03");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          mars,
          Constants.JULIAN_DAY_2000 + 0.25,
          Constants.EPHEMERIS_TYPE.LOWER_TRANSIT,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 03:20");
    expect(
      kirunaObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000,
          Constants.EPHEMERIS_TYPE.LOWER_TRANSIT,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 22:42");
  });

  it("should calculate rise times correctly", function () {
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 - 0.25,
          Constants.EPHEMERIS_TYPE.SUNRISE,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 08:05");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000,
          Constants.EPHEMERIS_TYPE.SUNRISE,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 08:05");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 + 0.25,
          Constants.EPHEMERIS_TYPE.SUNRISE,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 08:05");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 + 0.5,
          Constants.EPHEMERIS_TYPE.SUNRISE,
        )
        .toUTCString(),
    ).toContain("Sun, 02 Jan 2000 08:05");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          mars,
          Constants.JULIAN_DAY_2000 + 0.25,
          Constants.EPHEMERIS_TYPE.RISE,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 10:28");
    expect(
      kirunaObserver.getDateForPositionalEphemeris(
        sun,
        Constants.JULIAN_DAY_2000,
        Constants.EPHEMERIS_TYPE.SUNRISE,
      ),
    ).toBeNull();
    expect(
      kirunaObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 + 30,
          Constants.EPHEMERIS_TYPE.SUNRISE,
        )
        .toUTCString(),
    ).toContain("Mon, 31 Jan 2000 08:02");
  });

  it("should calculate set times correctly", function () {
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 - 0.25,
          Constants.EPHEMERIS_TYPE.SUNSET,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 16:01");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000,
          Constants.EPHEMERIS_TYPE.SUNSET,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 16:01");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 + 0.25,
          Constants.EPHEMERIS_TYPE.SUNSET,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 16:01");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 + 0.5,
          Constants.EPHEMERIS_TYPE.SUNSET,
        )
        .toUTCString(),
    ).toContain("Sun, 02 Jan 2000 16:02");
    expect(
      greenwichObserver
        .getDateForPositionalEphemeris(
          mars,
          Constants.JULIAN_DAY_2000 + 0.25,
          Constants.EPHEMERIS_TYPE.SET,
        )
        .toUTCString(),
    ).toContain("Sat, 01 Jan 2000 20:12");
    expect(
      kirunaObserver.getDateForPositionalEphemeris(
        sun,
        Constants.JULIAN_DAY_2000,
        Constants.EPHEMERIS_TYPE.SUNSET,
      ),
    ).toBeNull();
    expect(
      kirunaObserver
        .getDateForPositionalEphemeris(
          sun,
          Constants.JULIAN_DAY_2000 + 30,
          Constants.EPHEMERIS_TYPE.SUNSET,
        )
        .toUTCString(),
    ).toContain("Mon, 31 Jan 2000 13:44");
  });
});
