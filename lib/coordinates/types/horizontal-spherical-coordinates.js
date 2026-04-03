/**
 * @param {number} azimuth - azimuth in degrees
 * @param {number} altitude - altitude in degrees
 * @param {number} distance - distance in AU
 */
export class HorizontalSphericalCoordinates {
  constructor(azimuth, altitude, distance) {
    this.azimuth = azimuth;
    this.altitude = altitude;
    this.distance = distance;
  }
}
