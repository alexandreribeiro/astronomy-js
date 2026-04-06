import { EclipticSphericalCoordinates } from "./types/ecliptic-spherical-coordinates.js";
import { EquatorialSphericalCoordinates } from "./types/equatorial-spherical-coordinates.js";
import { MathHelper } from "../math-helper.js";
import { HorizontalSphericalCoordinates } from "./types/horizontal-spherical-coordinates.js";
import { Constants } from "../constants.js";
import { TopocentricEquatorialRightAscensionDeclinationCoordinates } from "./types/topocentric-equatorial-right-ascension-declination-coordinates.js";

export class CoordinatesConverter {
  /*
   * @param {EclipticRectangularCoordinates} eclipticRectangularCoordinates
   * @returns {EclipticSphericalCoordinates}
   */
  static eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
    eclipticRectangularCoordinates,
  ) {
    const delta = Math.sqrt(
      eclipticRectangularCoordinates.x * eclipticRectangularCoordinates.x +
        eclipticRectangularCoordinates.y * eclipticRectangularCoordinates.y +
        eclipticRectangularCoordinates.z * eclipticRectangularCoordinates.z,
    );
    const lambda =
      Math.atan2(
        eclipticRectangularCoordinates.y,
        eclipticRectangularCoordinates.x,
      ) *
      (180 / Math.PI);
    const beta =
      Math.asin(eclipticRectangularCoordinates.z / delta) * (180 / Math.PI);
    const lambda360 = (lambda + 360) % 360;

    return new EclipticSphericalCoordinates(
      lambda360,
      beta,
      delta,
      eclipticRectangularCoordinates.center,
    );
  }

  /*
   * @param {EclipticSphericalCoordinates} eclipticSphericalCoordinates
   * @param {number} obliquity - obliquity of the ecliptic in degrees
   * @returns {EquatorialSphericalCoordinates}
   */
  static eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(
    eclipticSphericalCoordinates,
    obliquity,
  ) {
    const lambdaInRadians = MathHelper.degreesToRadians(
      eclipticSphericalCoordinates.lambda,
    );
    const betaInRadians = MathHelper.degreesToRadians(
      eclipticSphericalCoordinates.beta,
    );
    const obliquityInRadians = MathHelper.degreesToRadians(obliquity);

    const declinationSin =
      Math.sin(betaInRadians) * Math.cos(obliquityInRadians) +
      Math.cos(betaInRadians) *
        Math.sin(obliquityInRadians) *
        Math.sin(lambdaInRadians);

    const y =
      Math.sin(lambdaInRadians) * Math.cos(obliquityInRadians) -
      Math.tan(betaInRadians) * Math.sin(obliquityInRadians);
    const x = Math.cos(lambdaInRadians);
    const rightAscensionInRadians = Math.atan2(y, x);

    const rightAscension = MathHelper.modDegrees(
      MathHelper.radiansToDegrees(rightAscensionInRadians),
    );
    const declination = MathHelper.radiansToDegrees(Math.asin(declinationSin));

    return new EquatorialSphericalCoordinates(
      rightAscension,
      declination,
      eclipticSphericalCoordinates.delta,
      obliquity,
      eclipticSphericalCoordinates.center,
    );
  }

  /**
   * @param {EquatorialSphericalCoordinates} equatorialSphericalCoordinates
   * @param {number} observerLatitude - geographic latitude of the observer in degrees
   * @param {number} observerElevation - elevation of the observer in meters
   * @param {number} localMeanSiderealTime - local sidereal time in degrees
   * @returns {TopocentricEquatorialRightAscensionDeclinationCoordinates}
   */
  static equatorialSphericalGeocentricToEquatorialSphericalTopocentric(
    equatorialSphericalCoordinates,
    observerLatitude,
    observerElevation,
    localMeanSiderealTime,
  ) {
    const radiusFromObjectCenterInMeters =
      equatorialSphericalCoordinates.center.meanRadius;

    const rightAscensionInRadians = MathHelper.degreesToRadians(
      equatorialSphericalCoordinates.rightAscension,
    );
    const declinationInRadians = MathHelper.degreesToRadians(
      equatorialSphericalCoordinates.declination,
    );
    const observerLatitudeInRadians =
      MathHelper.degreesToRadians(observerLatitude);
    const localMeanSiderealTimeInRadians = MathHelper.degreesToRadians(
      localMeanSiderealTime,
    );

    const u = Math.atan(
      (1 - equatorialSphericalCoordinates.center.flattening) *
        Math.tan(observerLatitudeInRadians),
    );
    const rhoSinPhiPrime =
      (1 - equatorialSphericalCoordinates.center.flattening) * Math.sin(u) +
      (observerElevation / radiusFromObjectCenterInMeters) *
        Math.sin(observerLatitudeInRadians);
    const rhoCosPhiPrime =
      Math.cos(u) +
      (observerElevation / radiusFromObjectCenterInMeters) *
        Math.cos(observerLatitudeInRadians);

    const equatorialHorizontalParallaxInRadians = Math.asin(
      equatorialSphericalCoordinates.center.meanRadius /
        Constants.METERS_PER_AU /
        equatorialSphericalCoordinates.delta,
    );
    const localHourAngleInRadians =
      localMeanSiderealTimeInRadians - rightAscensionInRadians;

    const deltaRightAscensionInRadians = Math.atan2(
      -rhoCosPhiPrime *
        Math.sin(equatorialHorizontalParallaxInRadians) *
        Math.sin(localHourAngleInRadians),
      Math.cos(declinationInRadians) -
        rhoCosPhiPrime *
          Math.sin(equatorialHorizontalParallaxInRadians) *
          Math.cos(localHourAngleInRadians),
    );

    const topocentricRightAscension = MathHelper.modDegrees(
      MathHelper.radiansToDegrees(
        rightAscensionInRadians + deltaRightAscensionInRadians,
      ),
    );

    const topocentricDeclination = MathHelper.radiansToDegrees(
      Math.atan2(
        (Math.sin(declinationInRadians) -
          rhoSinPhiPrime * Math.sin(equatorialHorizontalParallaxInRadians)) *
          Math.cos(deltaRightAscensionInRadians),
        Math.cos(declinationInRadians) -
          rhoCosPhiPrime *
            Math.sin(equatorialHorizontalParallaxInRadians) *
            Math.cos(localHourAngleInRadians),
      ),
    );

    return new TopocentricEquatorialRightAscensionDeclinationCoordinates(
      topocentricRightAscension,
      topocentricDeclination,
    );
  }

  /**
   * @param {TopocentricEquatorialRightAscensionDeclinationCoordinates} equatorialSphericalTopocentricCoordinates
   * @param {number} observerLatitude - geographic latitude of the observer in degrees
   * @param localMeanSiderealTime
   * @returns {HorizontalSphericalCoordinates}
   */
  static topocentricEquatorialRightAscensionDeclinationToHorizontalCoordinates(
    equatorialSphericalTopocentricCoordinates,
    observerLatitude,
    localMeanSiderealTime,
  ) {
    const rightAscensionInRadians = MathHelper.degreesToRadians(
      equatorialSphericalTopocentricCoordinates.rightAscension,
    );
    const declinationInRadians = MathHelper.degreesToRadians(
      equatorialSphericalTopocentricCoordinates.declination,
    );
    const observerLatitudeInRadians =
      MathHelper.degreesToRadians(observerLatitude);
    const localMeanSiderealTimeInRadians = MathHelper.degreesToRadians(
      localMeanSiderealTime,
    );

    const localHourAngleInRadians =
      localMeanSiderealTimeInRadians - rightAscensionInRadians;

    const altitudeInRadians = Math.asin(
      Math.sin(observerLatitudeInRadians) * Math.sin(declinationInRadians) +
        Math.cos(observerLatitudeInRadians) *
          Math.cos(declinationInRadians) *
          Math.cos(localHourAngleInRadians),
    );

    const azimuthInRadians = Math.atan2(
      Math.sin(localHourAngleInRadians),
      Math.cos(localHourAngleInRadians) * Math.sin(observerLatitudeInRadians) -
        Math.tan(declinationInRadians) * Math.cos(observerLatitudeInRadians),
    );

    const altitude = MathHelper.radiansToDegrees(altitudeInRadians);
    const azimuth = MathHelper.modDegrees(
      MathHelper.radiansToDegrees(azimuthInRadians) + 180,
    );

    return new HorizontalSphericalCoordinates(azimuth, altitude);
  }
}
