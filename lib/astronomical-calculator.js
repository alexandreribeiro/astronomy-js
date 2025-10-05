import { RectangularCoordinates } from "./coordinates/rectangular-coordinates";
import { MathHelper } from "./math-helper";
import { SphericalCoordinates } from "./coordinates/spherical-coordinates";
import { TimeHelper } from "./time-helper";
import { Constants } from "./constants";

export class AstronomicalCalculator {
  constructor(sphericalCoordinates, solarSystemObject) {
    this.sphericalCoordinates =
      sphericalCoordinates ||
      new SphericalCoordinates(
        Constants.GREENWICH_OBSERVATORY_COORDINATES.LATITUDE,
        Constants.GREENWICH_OBSERVATORY_COORDINATES.LONGITUDE,
        Constants.GREENWICH_OBSERVATORY_COORDINATES.RADIUS,
      );
    this.solarSystemObject = solarSystemObject;
  }

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
      );
  }

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
    return new RectangularCoordinates(
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
      this.getLocalSiderealTime(julianDate) - rightAscension,
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
        equatorialCoordinates.longitude - this.getLocalSiderealTime(julianDate),
      ),
    );
    const latitude = MathHelper.degreesToRadians(
      this.sphericalCoordinates.latitude,
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

  getLocalSiderealTime(julianDate) {
    return MathHelper.modDegrees(
      TimeHelper.meanSiderealTime(julianDate) +
        this.sphericalCoordinates.longitude,
    );
  }

  getObjectTransit(otherSolarSystemObject, julianDate) {
    const rightAscension = this.getRADecCoordinatesForSolarSystemObject(
      otherSolarSystemObject,
      julianDate,
    ).longitude;
    return this.getLocalSiderealTime(julianDate) - rightAscension;
  }

  getObjectLowerTransit(otherSolarSystemObject, julianDate) {
    const rightAscension = this.getRADecCoordinatesForSolarSystemObject(
      otherSolarSystemObject,
      julianDate,
    ).longitude;
    const angle = this.getLocalSiderealTime(julianDate) - rightAscension - 180;
    return MathHelper.mod180Degrees(angle);
  }

  getObjectLocalHourAngleForAltitude(
    otherSolarSystemObject,
    julianDate,
    altitude,
  ) {
    const observerLatitude = MathHelper.degreesToRadians(
      this.sphericalCoordinates.latitude,
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
    for (let loopCount = 0; loopCount < 1000; loopCount++) {
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
    return TimeHelper.julianDateToDate(result);
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
      result.getDate() !== TimeHelper.julianDateToDate(julianDate).getDate()
    ) {
      const resultAsJulianDate = TimeHelper.julianDate(result);
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
