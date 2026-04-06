/**
 * @param {number} hourAngle - hourAngle in degrees
 * @param {number} declination - declination in degrees
 * @param {number} distance - distance in AU
 */
export class TopocentricEquatorialHourAngleDeclinationCoordinates {
  constructor(hourAngle, declination, distance) {
    this.hourAngle = hourAngle;
    this.declination = declination;
    this.distance = distance;
  }
}
