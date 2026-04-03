/**
 * @param {number} x in AU
 * @param {number} y in AU
 * @param {number} z in AU
 * @param {SolarSystemObject} center - reference frame
 */
export class EclipticRectangularCoordinates {
  constructor(x, y, z, center) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.center = center;
  }

  /**
   * @param {EclipticRectangularCoordinates} eclipticRectangularCoordinates
   * @param {SolarSystemObject} center
   * @returns {EclipticRectangularCoordinates}
   */
  minus(eclipticRectangularCoordinates, center) {
    return new EclipticRectangularCoordinates(
      this.x - eclipticRectangularCoordinates.x,
      this.y - eclipticRectangularCoordinates.y,
      this.z - eclipticRectangularCoordinates.z,
      center,
    );
  }
}
