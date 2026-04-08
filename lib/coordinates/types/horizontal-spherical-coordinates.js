/**
 * @param {number} azimuth - azimuth in degrees
 * @param {number} altitude - altitude in degrees
 * @param {number} distance - distance in AU
 * @param {ObserverLocation} observerLocation - topocentric reference frame
 */
export class HorizontalSphericalCoordinates {
  constructor(azimuth, altitude, distance, observerLocation) {
    this.azimuth = azimuth;
    this.altitude = altitude;
    this.distance = distance;
    this.observerLocation = observerLocation;
  }
}
