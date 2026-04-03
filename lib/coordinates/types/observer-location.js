/**
 * @param {number} longitude - longitude in degrees
 * @param {number} latitude - latitude in degrees
 * @param {number} elevation - elevation in meters from the surface
 * @param {SolarSystemObject} center - reference frame
 */
export class ObserverLocation {
  constructor(longitude, latitude, elevation, center) {
    this.longitude = longitude;
    this.latitude = latitude;
    this.elevation = elevation;
    this.center = center;
  }
}
