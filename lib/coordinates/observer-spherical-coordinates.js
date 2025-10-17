/**
 * @param {number} longitude - longitude in degrees
 * @param {number} latitude - latitude in degrees
 * @param {number} radius - radius in KM
 * @param {SkyObject} center - center of the coordinate system
 */
export class ObserverSphericalCoordinates {
  constructor(longitude, latitude, radius, center) {
    this.longitude = longitude;
    this.latitude = latitude;
    this.radius = radius;
    this.center = center;
  }
}
