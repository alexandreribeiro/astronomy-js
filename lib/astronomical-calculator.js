import { MathHelper } from "./math-helper";
import { JulianDateCalculator } from "./time/julian-date-calculator.js";
import { Constants } from "./constants";
import { ObserverLocation } from "./coordinates/types/observer-location.js";
import { SphericalCoordinates } from "./coordinates/types/spherical-coordinates.js";
import { EclipticRectangularCoordinates } from "./coordinates/types/ecliptic-rectangular-coordinates.js";
import { CoordinatesConverter } from "./coordinates/coordinates-converter.js";
import { EquatorialSphericalCoordinates } from "./coordinates/types/equatorial-spherical-coordinates.js";
import { Earth } from "./solar-system-objects/planets/earth.js";

/**
 * @class AstronomicalCalculator
 * @description Class for calculating astronomical coordinates and ephemeris.
 */
export class AstronomicalCalculator {
  static getHorizontalSphericalCoordinatesForSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const observerEclipticRectangularHeliocentricCoordinates =
      observerLocation.center.getRectangularHeliocentricCoordinates(julianDate);

    const otherSolarSystemObjectEclipticRectangularHeliocentricCoordinates =
      otherSolarSystemObject.getRectangularHeliocentricCoordinates(julianDate);

    const eclipticRectangularObserverCoordinates =
      otherSolarSystemObjectEclipticRectangularHeliocentricCoordinates.minus(
        observerEclipticRectangularHeliocentricCoordinates,
        otherSolarSystemObjectEclipticRectangularHeliocentricCoordinates.center,
      );

    const eclipticSphericalObserverCoordinates =
      CoordinatesConverter.eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
        eclipticRectangularObserverCoordinates,
      );

    const equatorialSphericalObserverCoordinates =
      CoordinatesConverter.eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(
        eclipticSphericalObserverCoordinates,
        observerLocation.center.getObliquity(julianDate),
      );

    const rightAscension =
      equatorialSphericalObserverCoordinates.rightAscension;
    const declination = equatorialSphericalObserverCoordinates.declination;
    const distance = equatorialSphericalObserverCoordinates.delta;

    const localMeanSiderealTime = this.getLocalMeanSiderealTime(
      observerLocation,
      julianDate,
    );

    const equatorialCoordinates = new EquatorialSphericalCoordinates(
      rightAscension,
      declination,
      distance,
      observerLocation.center.getObliquity(julianDate),
      observerLocation.center,
    );

    const topocentricCoordinates =
      CoordinatesConverter.equatorialSphericalGeocentricToEquatorialSphericalTopocentric(
        equatorialCoordinates,
        observerLocation.latitude,
        observerLocation.elevation,
        localMeanSiderealTime,
      );

    return CoordinatesConverter.equatorialSphericalTopocentricToHorizontalSphericalCoordinates(
      topocentricCoordinates,
      observerLocation.latitude,
      localMeanSiderealTime,
    );
  }

  /**
   * @param observerLocation
   * @param otherSolarSystemObject
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
   */
  static getRectangularObjectCentricCoordinatesForSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    return otherSolarSystemObject
      .getRectangularHeliocentricCoordinates(julianDate)
      .minus(
        observerLocation.center.getRectangularHeliocentricCoordinates(
          julianDate,
        ),
        observerLocation.center,
      );
  }

  /**
   * @param observerLocation
   * @param otherSolarSystemObject
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
   */
  static getRectangularEquatorialCoordinatesForSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const rectangularObjectCentricCoordinatesForSolarSystemObject =
      this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      );
    const axialTiltInRadians = MathHelper.degreesToRadians(
      observerLocation.center.axialTilt,
    );
    return new EclipticRectangularCoordinates(
      rectangularObjectCentricCoordinatesForSolarSystemObject.x,
      rectangularObjectCentricCoordinatesForSolarSystemObject.y *
        Math.cos(axialTiltInRadians) -
        rectangularObjectCentricCoordinatesForSolarSystemObject.z *
          Math.sin(axialTiltInRadians),
      rectangularObjectCentricCoordinatesForSolarSystemObject.y *
        Math.sin(axialTiltInRadians) +
        rectangularObjectCentricCoordinatesForSolarSystemObject.z *
          Math.cos(axialTiltInRadians),
    );
  }

  static getDistanceToSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const objectCentricCoordinates =
      this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      );
    return Math.sqrt(
      Math.pow(objectCentricCoordinates.x, 2) +
        Math.pow(objectCentricCoordinates.y, 2) +
        Math.pow(objectCentricCoordinates.z, 2),
    );
  }

  static getRADecCoordinatesForSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const equatorialCoordinates =
      this.getRectangularEquatorialCoordinatesForSolarSystemObject(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      );
    const correction =
      equatorialCoordinates.x > 0 && equatorialCoordinates.y < 0
        ? 360
        : equatorialCoordinates.x < 0
          ? 180
          : 0;
    const rightAscension =
      MathHelper.radiansToDegrees(
        Math.atan(equatorialCoordinates.y / equatorialCoordinates.x),
      ) + correction;
    const declination = MathHelper.radiansToDegrees(
      Math.atan(
        equatorialCoordinates.z /
          Math.sqrt(
            Math.pow(equatorialCoordinates.x, 2) +
              Math.pow(equatorialCoordinates.y, 2),
          ),
      ),
    );
    return new SphericalCoordinates(
      declination,
      rightAscension,
      this.getDistanceToSolarSystemObject(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      ),
    );
  }

  static getHADecCoordinatesForSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const equatorialCoordinates =
      this.getRectangularEquatorialCoordinatesForSolarSystemObject(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      );
    const correction =
      equatorialCoordinates.x > 0 && equatorialCoordinates.y < 0
        ? 360
        : equatorialCoordinates.x < 0
          ? 180
          : 0;
    const rightAscension =
      MathHelper.radiansToDegrees(
        Math.atan(equatorialCoordinates.y / equatorialCoordinates.x),
      ) + correction;
    const localHourAngle = MathHelper.modDegrees(
      this.getLocalMeanSiderealTime(observerLocation, julianDate) -
        rightAscension,
    );
    const declination = MathHelper.radiansToDegrees(
      Math.atan(
        equatorialCoordinates.z /
          Math.sqrt(
            Math.pow(equatorialCoordinates.x, 2) +
              Math.pow(equatorialCoordinates.y, 2),
          ),
      ),
    );
    return new SphericalCoordinates(
      declination,
      localHourAngle,
      this.getDistanceToSolarSystemObject(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      ),
    );
  }

  static getAltAzCoordinatesForEquatorialCoordinates(
    observerLocation,
    equatorialCoordinates,
    julianDate,
  ) {
    const hourAngle = MathHelper.degreesToRadians(
      MathHelper.modDegrees(
        equatorialCoordinates.longitude -
          this.getLocalMeanSiderealTime(observerLocation, julianDate),
      ),
    );
    const latitude = MathHelper.degreesToRadians(observerLocation.latitude);
    const declination = MathHelper.degreesToRadians(
      equatorialCoordinates.latitude,
    );
    const altitude = MathHelper.radiansToDegrees(
      Math.asin(
        Math.sin(latitude) * Math.sin(declination) +
          Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle),
      ),
    );
    const azimuth = MathHelper.radiansToDegrees(
      Math.PI -
        Math.atan2(
          Math.sin(hourAngle),
          Math.cos(hourAngle) * Math.sin(latitude) -
            Math.tan(declination) * Math.cos(latitude),
        ),
    );
    return new SphericalCoordinates(altitude, azimuth, null);
  }

  static getLocalMeanSiderealTime(observerLocation, julianDate) {
    return MathHelper.modDegrees(
      observerLocation.center.getPrimeMeridianMeanSiderealTime(julianDate) +
        observerLocation.longitude,
    );
  }

  static getObjectTransit(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const rightAscension = this.getRADecCoordinatesForSolarSystemObject(
      observerLocation,
      otherSolarSystemObject,
      julianDate,
    ).longitude;
    return (
      this.getLocalMeanSiderealTime(observerLocation, julianDate) -
      rightAscension
    );
  }

  static getObjectLowerTransit(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const rightAscension = this.getRADecCoordinatesForSolarSystemObject(
      observerLocation,
      otherSolarSystemObject,
      julianDate,
    ).longitude;
    const angle =
      this.getLocalMeanSiderealTime(observerLocation, julianDate) -
      rightAscension -
      180;
    return MathHelper.mod180Degrees(angle);
  }

  static getObjectLocalHourAngleForAltitude(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
    altitude,
  ) {
    const observerLatitude = MathHelper.degreesToRadians(
      observerLocation.latitude,
    );
    const objectAltitude = MathHelper.degreesToRadians(altitude);
    const objectDeclination = MathHelper.degreesToRadians(
      this.getRADecCoordinatesForSolarSystemObject(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      ).latitude,
    );
    const localHourAngle =
      (Math.sin(objectAltitude) -
        Math.sin(observerLatitude) * Math.sin(objectDeclination)) /
      (Math.cos(observerLatitude) * Math.cos(objectDeclination));
    return MathHelper.radiansToDegrees(Math.acos(localHourAngle));
  }

  static getIterationValueForPositionalEphemerisForObject(
    observerLocation,
    solarSystemObject,
    julianDate,
    ephemerisType,
  ) {
    if (ephemerisType === Constants.EPHEMERIS_TYPE.TRANSIT) {
      return (
        julianDate -
        this.getObjectTransit(observerLocation, solarSystemObject, julianDate) /
          15 /
          24
      );
    } else if (ephemerisType === Constants.EPHEMERIS_TYPE.LOWER_TRANSIT) {
      return (
        julianDate -
        this.getObjectLowerTransit(
          observerLocation,
          solarSystemObject,
          julianDate,
        ) /
          15 /
          24
      );
    } else {
      const objectTransit = this.getObjectTransit(
        observerLocation,
        solarSystemObject,
        julianDate,
      );
      const localHourAngle = this.getObjectLocalHourAngleForAltitude(
        observerLocation,
        solarSystemObject,
        julianDate,
        ephemerisType.ALTITUDE,
      );
      const angleUntilRise = MathHelper.mod180Degrees(
        ephemerisType.IS_GOING_UP
          ? objectTransit + localHourAngle
          : objectTransit - localHourAngle,
      );
      return julianDate - angleUntilRise / 15 / 24;
    }
  }

  static iteratePositionalEphemerisForObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
    ephemerisType,
  ) {
    let result = this.getIterationValueForPositionalEphemerisForObject(
      observerLocation,
      otherSolarSystemObject,
      julianDate,
      ephemerisType,
    );
    let oldResult = +result;
    for (let loopCount = 0; loopCount < 1000 && !isNaN(result); loopCount++) {
      result = this.getIterationValueForPositionalEphemerisForObject(
        observerLocation,
        otherSolarSystemObject,
        result,
        ephemerisType,
      );
      if (Math.abs(result - oldResult) < 1e-5) {
        break;
      }
      oldResult = result;
    }
    return JulianDateCalculator.julianDateToDate(result);
  }

  static getCorrectDateForPositionalEphemeris(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
    ephemerisType,
    numberOfAttemptsLeft,
  ) {
    const result = this.iteratePositionalEphemerisForObject(
      observerLocation,
      otherSolarSystemObject,
      julianDate,
      ephemerisType,
    );
    if (
      numberOfAttemptsLeft > 0 &&
      result.getDate() !==
        JulianDateCalculator.julianDateToDate(julianDate).getDate()
    ) {
      const resultAsJulianDate = JulianDateCalculator.julianDate(result);
      const deltaDays = resultAsJulianDate > julianDate ? -1 : 1;
      return this.getCorrectDateForPositionalEphemeris(
        observerLocation,
        otherSolarSystemObject,
        resultAsJulianDate + deltaDays,
        ephemerisType,
        numberOfAttemptsLeft - 1,
      );
    } else if (numberOfAttemptsLeft === 0) {
      return null;
    } else {
      return result;
    }
  }

  static getDateForPositionalEphemeris(
    observerLocation,
    solarSystemObject,
    julianDate,
    ephemerisType,
  ) {
    return this.getCorrectDateForPositionalEphemeris(
      observerLocation,
      solarSystemObject,
      julianDate,
      ephemerisType,
      Constants.NUMBERS_OF_ATTEMPT_TO_GET_POSITIONAL_EPHEMERIS,
    );
  }
}
