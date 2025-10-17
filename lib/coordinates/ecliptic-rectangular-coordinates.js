/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {SkyObject} center - center of the ecliptic
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
   * @param {SkyObject} center
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
