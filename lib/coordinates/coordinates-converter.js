import { EclipticSphericalCoordinates } from "./types/ecliptic-spherical-coordinates.js";
import { EquatorialSphericalCoordinates } from "./types/equatorial-spherical-coordinates.js";
import { AngleCalculator } from "../angle-calculator.js";
import { HorizontalSphericalCoordinates } from "./types/horizontal-spherical-coordinates.js";
import { Constants } from "../constants.js";
import { TopocentricEquatorialSphericalCoordinates } from "./types/topocentric-equatorial-spherical-coordinates.js";

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
    const lambdaInRadians = AngleCalculator.degreesToRadians(
      eclipticSphericalCoordinates.lambda,
    );
    const betaInRadians = AngleCalculator.degreesToRadians(
      eclipticSphericalCoordinates.beta,
    );
    const obliquityInRadians = AngleCalculator.degreesToRadians(obliquity);

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

    const rightAscension = AngleCalculator.modDegrees(
      AngleCalculator.radiansToDegrees(rightAscensionInRadians),
    );
    const declination = AngleCalculator.radiansToDegrees(
      Math.asin(declinationSin),
    );

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
   * @param {ObserverLocation} observerLocation - location of the observer
   * @param {number} localMeanSiderealTime - local sidereal time in degrees
   * @returns {TopocentricEquatorialSphericalCoordinates}
   */
  static equatorialSphericalGeocentricToEquatorialSphericalTopocentric(
    equatorialSphericalCoordinates,
    observerLocation,
    localMeanSiderealTime,
  ) {
    const radiusFromObjectCenterInMeters =
      equatorialSphericalCoordinates.center.meanRadius;

    const rightAscensionInRadians = AngleCalculator.degreesToRadians(
      equatorialSphericalCoordinates.rightAscension,
    );
    const declinationInRadians = AngleCalculator.degreesToRadians(
      equatorialSphericalCoordinates.declination,
    );
    const observerLatitudeInRadians = AngleCalculator.degreesToRadians(
      observerLocation.latitude,
    );
    const localMeanSiderealTimeInRadians = AngleCalculator.degreesToRadians(
      localMeanSiderealTime,
    );

    const u = Math.atan(
      (1 - equatorialSphericalCoordinates.center.flattening) *
        Math.tan(observerLatitudeInRadians),
    );
    const rhoSinPhiPrime =
      (1 - equatorialSphericalCoordinates.center.flattening) * Math.sin(u) +
      (observerLocation.elevation / radiusFromObjectCenterInMeters) *
        Math.sin(observerLatitudeInRadians);
    const rhoCosPhiPrime =
      Math.cos(u) +
      (observerLocation.elevation / radiusFromObjectCenterInMeters) *
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

    const topocentricRightAscension = AngleCalculator.modDegrees(
      AngleCalculator.radiansToDegrees(
        rightAscensionInRadians + deltaRightAscensionInRadians,
      ),
    );

    const topocentricDeclination = AngleCalculator.radiansToDegrees(
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

    return new TopocentricEquatorialSphericalCoordinates(
      topocentricRightAscension,
      topocentricDeclination,
      null,
      observerLocation,
    );
  }

  /**
   * @param {TopocentricEquatorialSphericalCoordinates} topocentricEquatorialSphericalCoordinates
   * @param localMeanSiderealTime
   * @returns {HorizontalSphericalCoordinates}
   */
  static topocentricEquatorialRightAscensionDeclinationToHorizontalCoordinates(
    topocentricEquatorialSphericalCoordinates,
    localMeanSiderealTime,
  ) {
    const rightAscensionInRadians = AngleCalculator.degreesToRadians(
      topocentricEquatorialSphericalCoordinates.rightAscension,
    );
    const declinationInRadians = AngleCalculator.degreesToRadians(
      topocentricEquatorialSphericalCoordinates.declination,
    );
    const observerLatitudeInRadians = AngleCalculator.degreesToRadians(
      topocentricEquatorialSphericalCoordinates.observerLocation.latitude,
    );
    const localMeanSiderealTimeInRadians = AngleCalculator.degreesToRadians(
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

    const altitude = AngleCalculator.radiansToDegrees(altitudeInRadians);
    const azimuth = AngleCalculator.modDegrees(
      AngleCalculator.radiansToDegrees(azimuthInRadians) + 180,
    );

    return new HorizontalSphericalCoordinates(
      azimuth,
      altitude,
      null,
      topocentricEquatorialSphericalCoordinates.observerLocation,
    );
  }
}
