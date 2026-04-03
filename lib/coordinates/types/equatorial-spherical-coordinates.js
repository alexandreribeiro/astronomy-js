/**
 * @param {number} rightAscension - right ascension in degrees
 * @param {number} declination - declination in degrees
 * @param {number} delta - distance in AU
 * @param {number} obliquity - obliquity of the ecliptic in degrees
 * @param {SolarSystemObject} center - reference frame
 */
export class EquatorialSphericalCoordinates {
  constructor(rightAscension, declination, delta, obliquity, center) {
    this.rightAscension = rightAscension;
    this.declination = declination;
    this.delta = delta;
    this.obliquity = obliquity;
    this.center = center;
  }
}
