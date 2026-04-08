/**
 * @param {number} rightAscension - rightAscension in degrees
 * @param {number} declination - declination in degrees
 * @param {number} distance - distance in AU
 * @param {ObserverLocation} observerLocation - topocentric reference frame
 */
export class TopocentricEquatorialSphericalCoordinates {
  constructor(rightAscension, declination, distance, observerLocation) {
    this.rightAscension = rightAscension;
    this.declination = declination;
    this.distance = distance;
    this.observerLocation = observerLocation;
  }
}
