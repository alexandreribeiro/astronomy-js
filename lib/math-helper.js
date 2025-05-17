export class MathHelper {
  static modDegrees(degrees) {
    while (degrees < 0) {
      degrees = degrees + 360;
    }
    return degrees % 360;
  }

  static mod180Degrees(degrees) {
    const result = this.modDegrees(degrees);
    return result > 180 ? result - 360 : result;
  }

  static modRadians(radians) {
    while (radians < 0) {
      radians = radians + 2 * Math.PI;
    }
    return radians % (2 * Math.PI);
  }

  static modPiRadians(radians) {
    const result = this.modRadians(radians);
    return radians > Math.PI ? result - 2 * Math.PI : result;
  }

  static radiansToDegrees(radians) {
    return (radians * 180.0) / Math.PI;
  }

  static degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180.0;
  }

  static padZero(originalString) {
    originalString = originalString.toString();
    return originalString.length >= 2 ? originalString : "0" + originalString;
  }
}
