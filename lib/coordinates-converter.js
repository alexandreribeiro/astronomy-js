import { EclipticSphericalCoordinates } from "./coordinates/ecliptic-spherical-coordinates.js";
import { EquatorialSphericalCoordinates } from "./coordinates/equatorial-spherical-coordinates.js";
import { MathHelper } from "./math-helper.js";

export class CoordinatesConverter {
  /*
   * @param {EclipticRectangularCoordinates} eclipticRectangularCoordinates - coordinates in AU
   * @returns {EclipticSphericalCoordinates}
   */
  eclipticRectangularCoordinatesToEclipticSphericalCoordinates(
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
  eclipticSphericalCoordinatesToEquatorialSphericalCoordinates(
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
   * @param {EclipticRectangularCoordinates} eclipticRectangularCoordinates in AU
   * @param {number} obliquity - obliquity of the ecliptic in degrees
   * @returns {EquatorialRectangularCoordinates} in degrees
   */
  eclipticRectangularCoordinatesToEquatorialRectangularCoordinates(
    eclipticRectangularCoordinates,
    obliquity,
  ) {
    const obliquityInRadians = MathHelper.degreesToRadians(obliquity);
    return new EquatorialRectangularCoordinates(
      eclipticRectangularCoordinates.x,
      eclipticRectangularCoordinates.y * Math.cos(obliquityInRadians) -
        eclipticRectangularCoordinates.z * Math.sin(obliquityInRadians),
      eclipticRectangularCoordinates.y * Math.sin(obliquityInRadians) +
        eclipticRectangularCoordinates.z * Math.cos(obliquityInRadians),
    );
  }
}
