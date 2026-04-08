/**
 * @param {number} x - x coordinate in AU
 * @param {number} y - y coordinate in AU
 * @param {number} z - z coordinate in AU
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
   * @param {EclipticRectangularCoordinates} eclipticRectangularCoordinates - ecliptic rectangular coordinates
   * @param {SolarSystemObject} center - reference frame
   * @returns {EclipticRectangularCoordinates} - difference between coordinates
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
