import { Constants } from "../constants.js";

export class JulianDateCalculator {
  /**
   * @param {Date} referenceDate - reference date
   * @returns {number} - Julian date
   */
  static julianDate(referenceDate) {
    return referenceDate / Constants.MS_PER_DAY + Constants.JULIAN_DAY_OFFSET;
  }

  /**
   * @param {number} julianDate - Julian date
   * @returns {Date} - Date object
   */
  static julianDateToDate(julianDate) {
    return new Date(
      (julianDate - Constants.JULIAN_DAY_OFFSET) * Constants.MS_PER_DAY,
    );
  }

  /**
   * @param {number} julianDate - Julian date
   * @returns {number} - number of Julian days since epoch J2000.0
   */
  static julianDaysSinceEpoch2000(julianDate) {
    return julianDate - Constants.JULIAN_DAY_2000;
  }

  /**
   * @param {number} julianDate - Julian date
   * @returns {number} - number of Julian centuries since epoch J2000.0
   */
  static julianCenturiesSinceEpoch2000(julianDate) {
    return (
      this.julianDaysSinceEpoch2000(julianDate) /
      Constants.DAYS_PER_JULIAN_CENTURY
    );
  }
}
