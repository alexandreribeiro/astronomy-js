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
 * @param {ObserverLocation} observerLocation - The spherical coordinates of the observer.
 * @param {SolarSystemObject} solarSystemObject - The solar system object for which the coordinates are calculated.
 * @property {SphericalCoordinates} sphericalCoordinates - The spherical coordinates of the observer.
 * @property {SolarSystemObject} solarSystemObject - The solar system object for which the coordinates are calculated.
 * @property {EclipticRectangularCoordinates} rectangularCoordinates - The rectangular coordinates of the observer.
 * @property {EclipticRectangularCoordinates} rectangularHeliocentricCoordinates - The rectangular coordinates of the heliocentric observer.
 * @property {EclipticRectangularCoordinates} rectangularObjectCentricCoordinatesForSolarSystemObject - The rectangular coordinates of the object centric observer for the given solar system object.
 */
export class AstronomicalCalculator {
  constructor(observerLocation, solarSystemObject) {
    this.observerLocation =
      observerLocation ||
      new ObserverLocation(
        Constants.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
        Constants.GREENWICH_OBSERVATORY_COORDINATES.LONGITUDE,
        Constants.GREENWICH_OBSERVATORY_COORDINATES.RADIUS,
        new Earth(),
      );
    this.solarSystemObject = solarSystemObject;
  }

  getHorizontalSphericalCoordinatesForSolarSystemObject(
    observerSphericalCoordinates,
    otherSolarSystemObject,
    julianDate,
  ) {
    const observerEclipticRectangularHeliocentricCoordinates =
      this.observerLocation.center.getRectangularHeliocentricCoordinates(
        julianDate,
      );

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
        this.observerLocation.center.getObliquity(julianDate),
      );

    const rightAscension =
      equatorialSphericalObserverCoordinates.rightAscension;
    const declination = equatorialSphericalObserverCoordinates.declination;
    const distance = equatorialSphericalObserverCoordinates.delta;

    const localMeanSiderealTime = this.getLocalMeanSiderealTime(julianDate);
    const observerLatitude = this.observerLocation.latitude;
    const observerElevation = this.observerLocation.elevation;

    const equatorialCoordinates = new EquatorialSphericalCoordinates(
      rightAscension,
      declination,
      distance,
      this.observerLocation.center.getObliquity(julianDate),
      this.observerLocation.center,
    );

    const topocentricCoordinates =
      CoordinatesConverter.equatorialSphericalGeocentricToEquatorialSphericalTopocentric(
        equatorialCoordinates,
        observerLatitude,
        observerElevation,
        localMeanSiderealTime,
      );

    return CoordinatesConverter.equatorialSphericalTopocentricToHorizontalSphericalCoordinates(
      topocentricCoordinates,
      observerLatitude,
      localMeanSiderealTime,
    );
  }

  /**
   * @param otherSolarSystemObject
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
   */
  getRectangularObjectCentricCoordinatesForSolarSystemObject(
    otherSolarSystemObject,
    julianDate,
  ) {
    return otherSolarSystemObject
      .getRectangularHeliocentricCoordinates(julianDate)
      .minus(
        this.solarSystemObject.getRectangularHeliocentricCoordinates(
          julianDate,
        ),
        this.observerLocation.center,
      );
  }

  /**
   * @param otherSolarSystemObject
   * @param julianDate
   * @returns {EclipticRectangularCoordinates}
   */
  getRectangularEquatorialCoordinatesForSolarSystemObject(
    otherSolarSystemObject,
    julianDate,
  ) {
    const rectangularObjectCentricCoordinatesForSolarSystemObject =
      this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
        otherSolarSystemObject,
        julianDate,
      );
    const axialTiltInRadians = MathHelper.degreesToRadians(
      this.solarSystemObject.axialTilt,
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

  getDistanceToSolarSystemObject(otherSolarSystemObject, julianDate) {
    const objectCentricCoordinates =
      this.getRectangularObjectCentricCoordinatesForSolarSystemObject(
        otherSolarSystemObject,
        julianDate,
      );
    return Math.sqrt(
      Math.pow(objectCentricCoordinates.x, 2) +
        Math.pow(objectCentricCoordinates.y, 2) +
        Math.pow(objectCentricCoordinates.z, 2),
    );
  }

  getRADecCoordinatesForSolarSystemObject(otherSolarSystemObject, julianDate) {
    const equatorialCoordinates =
      this.getRectangularEquatorialCoordinatesForSolarSystemObject(
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
      this.getDistanceToSolarSystemObject(otherSolarSystemObject, julianDate),
    );
  }

  getHADecCoordinatesForSolarSystemObject(otherSolarSystemObject, julianDate) {
    const equatorialCoordinates =
      this.getRectangularEquatorialCoordinatesForSolarSystemObject(
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
      this.getLocalMeanSiderealTime(julianDate) - rightAscension,
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
      this.getDistanceToSolarSystemObject(otherSolarSystemObject, julianDate),
    );
  }

  getAltAzCoordinatesForEquatorialCoordinates(
    equatorialCoordinates,
    julianDate,
  ) {
    const hourAngle = MathHelper.degreesToRadians(
      MathHelper.modDegrees(
        equatorialCoordinates.longitude -
          this.getLocalMeanSiderealTime(julianDate),
      ),
    );
    const latitude = MathHelper.degreesToRadians(
      this.observerLocation.latitude,
    );
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

  getLocalMeanSiderealTime(julianDate) {
    return MathHelper.modDegrees(
      this.observerLocation.center.getPrimeMeridianMeanSiderealTime(
        julianDate,
      ) + this.observerLocation.longitude,
    );
  }

  getObjectTransit(otherSolarSystemObject, julianDate) {
    const rightAscension = this.getRADecCoordinatesForSolarSystemObject(
      otherSolarSystemObject,
      julianDate,
    ).longitude;
    return this.getLocalMeanSiderealTime(julianDate) - rightAscension;
  }

  getObjectLowerTransit(otherSolarSystemObject, julianDate) {
    const rightAscension = this.getRADecCoordinatesForSolarSystemObject(
      otherSolarSystemObject,
      julianDate,
    ).longitude;
    const angle =
      this.getLocalMeanSiderealTime(julianDate) - rightAscension - 180;
    return MathHelper.mod180Degrees(angle);
  }

  getObjectLocalHourAngleForAltitude(
    otherSolarSystemObject,
    julianDate,
    altitude,
  ) {
    const observerLatitude = MathHelper.degreesToRadians(
      this.observerLocation.latitude,
    );
    const objectAltitude = MathHelper.degreesToRadians(altitude);
    const objectDeclination = MathHelper.degreesToRadians(
      this.getRADecCoordinatesForSolarSystemObject(
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

  getIterationValueForPositionalEphemerisForObject(
    solarSystemObject,
    julianDate,
    ephemerisType,
  ) {
    if (ephemerisType === Constants.EPHEMERIS_TYPE.TRANSIT) {
      return (
        julianDate -
        this.getObjectTransit(solarSystemObject, julianDate) / 15 / 24
      );
    } else if (ephemerisType === Constants.EPHEMERIS_TYPE.LOWER_TRANSIT) {
      return (
        julianDate -
        this.getObjectLowerTransit(solarSystemObject, julianDate) / 15 / 24
      );
    } else {
      const objectTransit = this.getObjectTransit(
        solarSystemObject,
        julianDate,
      );
      const localHourAngle = this.getObjectLocalHourAngleForAltitude(
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

  iteratePositionalEphemerisForObject(
    otherSolarSystemObject,
    julianDate,
    ephemerisType,
  ) {
    let result = this.getIterationValueForPositionalEphemerisForObject(
      otherSolarSystemObject,
      julianDate,
      ephemerisType,
    );
    let oldResult = +result;
    for (let loopCount = 0; loopCount < 1000 && !isNaN(result); loopCount++) {
      result = this.getIterationValueForPositionalEphemerisForObject(
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

  getCorrectDateForPositionalEphemeris(
    otherSolarSystemObject,
    julianDate,
    ephemerisType,
    numberOfAttemptsLeft,
  ) {
    const result = this.iteratePositionalEphemerisForObject(
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

  getDateForPositionalEphemeris(solarSystemObject, julianDate, ephemerisType) {
    return this.getCorrectDateForPositionalEphemeris(
      solarSystemObject,
      julianDate,
      ephemerisType,
      Constants.NUMBERS_OF_ATTEMPT_TO_GET_POSITIONAL_EPHEMERIS,
    );
  }
}
