/**
 * @param {number} rightAscension - longitude or right ascension in degrees
 * @param {number} declination - latitude or declination in degrees
 * @param {number} distance - distance in AU
 * @param {number}  obliquity - obliquity of the ecliptic in degrees
 * @param {SkyObject} center - center of the coordinate system
 */
export class EquatorialSphericalCoordinates {
  constructor(rightAscension, declination, distance, obliquity, center) {
    this.rightAscension = rightAscension;
    this.declination = declination;
    this.distance = distance;
    this.obliquity = obliquity;
    this.center = center;
  }
}
