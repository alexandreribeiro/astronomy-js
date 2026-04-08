import { AngleCalculator } from "./angle-calculator.js";
import { JulianDateCalculator } from "./time/julian-date-calculator.js";
import { Constants } from "./constants";
import { EclipticRectangularCoordinates } from "./coordinates/types/ecliptic-rectangular-coordinates.js";
import { CoordinatesConverter } from "./coordinates/coordinates-converter.js";
import { EquatorialSphericalCoordinates } from "./coordinates/types/equatorial-spherical-coordinates.js";
import { TopocentricEquatorialHourAngleDeclinationCoordinates } from "./coordinates/types/topocentric-equatorial-hour-angle-declination-coordinates.js";

/**
 * @class AstronomicalCalculator
 * @description Class for calculating astronomical coordinates and ephemeris.
 */
export class AstronomicalCalculator {
  static getTopocentricEquatorialSphericalCoordinates(
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
      CoordinatesConverter.eclipticRectangularToEclipticSphericalCoordinates(
        eclipticRectangularObserverCoordinates,
      );

    const equatorialSphericalObserverCoordinates =
      CoordinatesConverter.eclipticSphericalToEquatorialSphericalCoordinates(
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

    return CoordinatesConverter.equatorialSphericalToTopocentricEquatorialSphericalCoordinates(
      equatorialCoordinates,
      observerLocation,
      localMeanSiderealTime,
    );
  }

  static getTopocentricHorizontalSphericalCoordinatesForSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const topocentricEquatorialRightAscensionDeclinationCoordinates =
      AstronomicalCalculator.getTopocentricEquatorialSphericalCoordinates(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      );

    const localMeanSiderealTime = this.getLocalMeanSiderealTime(
      observerLocation,
      julianDate,
    );

    return CoordinatesConverter.topocentricEquatorialToTopocentricHorizontalSphericalCoordinates(
      topocentricEquatorialRightAscensionDeclinationCoordinates,
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
    const axialTiltInRadians = AngleCalculator.degreesToRadians(
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

  static getHADecCoordinatesForSolarSystemObject(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const topocentricEquatorialRightAscensionDeclinationCoordinates =
      this.getTopocentricEquatorialSphericalCoordinates(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      );
    return new TopocentricEquatorialHourAngleDeclinationCoordinates(
      AngleCalculator.modDegrees(
        AstronomicalCalculator.getLocalMeanSiderealTime(
          observerLocation,
          julianDate,
        ) -
          topocentricEquatorialRightAscensionDeclinationCoordinates.rightAscension,
      ),
      topocentricEquatorialRightAscensionDeclinationCoordinates.declination,
      topocentricEquatorialRightAscensionDeclinationCoordinates.distance,
    );
  }

  static getLocalMeanSiderealTime(observerLocation, julianDate) {
    return AngleCalculator.modDegrees(
      observerLocation.center.getPrimeMeridianMeanSiderealTime(julianDate) +
        observerLocation.longitude,
    );
  }

  static getObjectTransit(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
  ) {
    const rightAscension = this.getTopocentricEquatorialSphericalCoordinates(
      observerLocation,
      otherSolarSystemObject,
      julianDate,
    ).rightAscension;
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
    const rightAscension = this.getTopocentricEquatorialSphericalCoordinates(
      observerLocation,
      otherSolarSystemObject,
      julianDate,
    ).rightAscension;
    const angle =
      this.getLocalMeanSiderealTime(observerLocation, julianDate) -
      rightAscension -
      180;
    return AngleCalculator.mod180Degrees(angle);
  }

  static getObjectLocalHourAngleForAltitude(
    observerLocation,
    otherSolarSystemObject,
    julianDate,
    altitude,
  ) {
    const observerLatitude = AngleCalculator.degreesToRadians(
      observerLocation.latitude,
    );
    const objectAltitude = AngleCalculator.degreesToRadians(altitude);
    const objectDeclination = AngleCalculator.degreesToRadians(
      this.getTopocentricEquatorialSphericalCoordinates(
        observerLocation,
        otherSolarSystemObject,
        julianDate,
      ).declination,
    );
    const localHourAngle =
      (Math.sin(objectAltitude) -
        Math.sin(observerLatitude) * Math.sin(objectDeclination)) /
      (Math.cos(observerLatitude) * Math.cos(objectDeclination));
    return AngleCalculator.radiansToDegrees(Math.acos(localHourAngle));
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
      const angleUntilRise = AngleCalculator.mod180Degrees(
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
