/**
 * @param {number} lambda - longitude in degrees
 * @param {number} beta - latitude in degrees
 * @param {number} delta - distance in AU
 * @param {SolarSystemObject} center - reference frame
 */
export class EclipticSphericalCoordinates {
  constructor(lambda, beta, delta, center) {
    this.lambda = lambda;
    this.beta = beta;
    this.delta = delta;
    this.center = center;
  }
}
