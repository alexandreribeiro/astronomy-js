import { MathHelper } from "../math-helper";

export class SphericalCoordinates {
  constructor(latitude, longitude, radius) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
  }

  toDegrees() {
    let latitude = this.latitude;
    let longitude = this.longitude;
    return new SphericalCoordinates(
      `${latitude < 0 ? "-" : ""}${MathHelper.padZero(0 | (latitude < 0 ? (latitude = -latitude) : latitude))}\u00B0 ` +
        `${MathHelper.padZero(0 | ((latitude % 1) * 60))}' ${MathHelper.padZero(0 | (((latitude * 60) % 1) * 60))}''`,
      `${longitude < 0 ? "-" : ""}${MathHelper.padZero(0 | (longitude < 0 ? (longitude = -longitude) : longitude))}\u00B0 ` +
        `${MathHelper.padZero(0 | ((longitude % 1) * 60))}' ${MathHelper.padZero(0 | (((longitude * 60) % 1) * 60))}''`,
      this.radius,
    );
  }

  toHours() {
    let latitude = this.latitude;
    let longitude = this.longitude;
    return new SphericalCoordinates(
      `${latitude < 0 ? "-" : ""}${MathHelper.padZero(0 | (latitude < 0 ? (latitude = -latitude) : latitude))}\u00B0 ` +
        `${MathHelper.padZero(0 | ((latitude % 1) * 60))}' ${MathHelper.padZero(0 | (((latitude * 60) % 1) * 60))}''`,
      `${longitude < 0 ? "-" : ""}${MathHelper.padZero(0 | (longitude < 0 ? (longitude = -longitude / 15) : (longitude = longitude / 15)))}h ` +
        `${MathHelper.padZero(0 | ((longitude % 1) * 60))}m ${MathHelper.padZero(0 | (((longitude * 60) % 1) * 60))}s`,
      this.radius,
    );
  }
}
