export class AngleCalculator {
  /**
   * @param {number} degrees - angle in degrees
   * @returns {number} - angle in degrees
   */
  static modDegrees(degrees) {
    while (degrees < 0) {
      degrees = degrees + 360;
    }
    return degrees % 360;
  }

  /**
   * @param {number} degrees - angle in degrees
   * @returns {number} - angle in degrees, normalized to range [-180, 180)
   */
  static mod180Degrees(degrees) {
    const result = this.modDegrees(degrees);
    return result > 180 ? result - 360 : result;
  }

  /**
   * @param {number} radians - angle in radians
   * @returns {number} - angle in radians
   */
  static modRadians(radians) {
    while (radians < 0) {
      radians = radians + 2 * Math.PI;
    }
    return radians % (2 * Math.PI);
  }

  /**
   * @param {number} radians - angle in radians
   * @returns {number} - angle in radians, normalized to range [-pi, pi)
   */
  static modPiRadians(radians) {
    const result = this.modRadians(radians);
    return result > Math.PI ? result - 2 * Math.PI : result;
  }

  /**
   * @param {number} radians - angle in radians
   * @returns {number} - angle in degrees
   */
  static radiansToDegrees(radians) {
    return radians * (180.0 / Math.PI);
  }

  /**
   * @param {number} degrees - angle in degrees
   * @returns {number} - angle in radians
   */
  static degreesToRadians(degrees) {
    return degrees * (Math.PI / 180.0);
  }
}
