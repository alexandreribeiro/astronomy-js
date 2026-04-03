import { JulianDateCalculator } from "../../lib/time/julian-date-calculator.js";
import { Constants } from "../../lib/constants.js";

describe("TimeHelper", function () {
  it("should calculate julian date in epoch day zero correctly", function () {
    expect(
      JulianDateCalculator.julianDate(Date.UTC(2000, 0, 1, 12, 0, 0)),
    ).toBe(Constants.JULIAN_DAY_2000);
  });
});
