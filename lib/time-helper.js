import { Constants } from "./constants";
import { MathHelper } from "./math-helper";

export class TimeHelper {
  static julianDate(date) {
    return date / Constants.MS_PER_DAY + Constants.JULIAN_DAY_OFFSET;
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

  static meanSiderealTime(julianDate) {
    const jd = this.julianDaysSinceEpoch2000(julianDate);
    const t = this.julianCenturiesSinceEpoch2000(julianDate);
    const result =
      280.46061837 +
      360.98564736629 * jd +
      0.000387933 * t * t -
      (t * t * t) / 38710000;
    return MathHelper.modDegrees(result);
  }
}
