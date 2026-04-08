import { OrbitalParameters } from "../orbital-parameters.js";
import { SkyObjectType } from "../../sky-object-type.js";
import { SolarSystemObject } from "../solar-system-object.js";
import { AngleCalculator } from "../../angle-calculator.js";
import { JulianDateCalculator } from "../../time/julian-date-calculator.js";

export class Earth extends SolarSystemObject {
  constructor() {
    const orbitalParameters = new OrbitalParameters(
      1.00000011,
      0.01671022,
      0.00005,
      -11.26064,
      102.94719,
      100.46435,
      -0.00000005,
      -0.00003804,
      -46.94,
      -18228.25,
      1198.28,
      129597740.63,
    );
    super(
      SkyObjectType.PLANET,
      "Earth",
      orbitalParameters,
      6378137,
      23.439281,
      1 / 298.257223563,
    );
  }

  getObliquity(julianDate) {
    const T = JulianDateCalculator.julianCenturiesSinceEpoch2000(julianDate);
    return (
      23.43929111 -
      (46.815 * T) / 3600 -
      (0.0006 * T * T) / 3600 +
      (0.001813 * T * T * T) / 3600
    );
  }

  getPrimeMeridianMeanSiderealTime(julianDate) {
    const julianDays =
      JulianDateCalculator.julianDaysSinceEpoch2000(julianDate);
    const T = JulianDateCalculator.julianCenturiesSinceEpoch2000(julianDate);
    const result =
      280.46061837 +
      360.98564736629 * julianDays +
      0.000387933 * T * T -
      (T * T * T) / 38710000;
    return AngleCalculator.modDegrees(result);
  }
}
