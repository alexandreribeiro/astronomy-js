import { Constants } from "../constants.js";

export class JulianDateCalculator {
  static julianDate(referenceDate) {
    return referenceDate / Constants.MS_PER_DAY + Constants.JULIAN_DAY_OFFSET;
  }

  static julianDateToDate(julianDate) {
    return new Date(
      (julianDate - Constants.JULIAN_DAY_OFFSET) * Constants.MS_PER_DAY,
    );
  }

  static julianDaysSinceEpoch2000(julianDate) {
    return julianDate - Constants.JULIAN_DAY_2000;
  }

  static julianCenturiesSinceEpoch2000(julianDate) {
    return (
      this.julianDaysSinceEpoch2000(julianDate) /
      Constants.DAYS_PER_JULIAN_CENTURY
    );
  }
}
