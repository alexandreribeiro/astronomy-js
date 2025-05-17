import { TimeHelper } from "../lib/time-helper";
import { Constants } from "../lib/constants";

describe("TimeHelper", function () {
  it("should calculate julian date in epoch day zero correctly", function () {
    expect(TimeHelper.julianDate(Date.UTC(2000, 0, 1, 12, 0, 0))).toBe(
      Constants.JULIAN_DAY_2000,
    );
  });
  it("should calculate mean sidereal time in epoch day zero correctly", function () {
    expect(TimeHelper.meanSiderealTime(Constants.JULIAN_DAY_2000)).toBeCloseTo(
      280.4606,
      4,
    );
  });
});
