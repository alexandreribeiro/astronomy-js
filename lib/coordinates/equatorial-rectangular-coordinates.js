/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number}  obliquity - obliquity of the ecliptic in degrees
 * @param {SkyObject} center - center of the ecliptic
 */
export class EquatorialRectangularCoordinates {
  constructor(x, y, z, obliquity, center) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.obliquity = obliquity;
    this.center = center;
  }
}
