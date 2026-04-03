import { Earth } from "../../../lib/solar-system-objects/planets/earth.js";
import { Constants } from "../../../lib/constants.js";

describe("Earth.getObliquity", () => {
  it("should calculate correctly for J2000.0", () => {
    const earth = new Earth();
    expect(earth.getObliquity(Constants.JULIAN_DAY_2000)).toBeCloseTo(
      23.43929111,
      8,
    );
  });

  it("should calculate correctly for J1987.0", () => {
    const JD_1987 = 2446800.5;
    expect(new Earth().getObliquity(JD_1987)).toBeCloseTo(23.44098031, 8);
  });

  it("should calculate prime meridian mean sidereal time in epoch day zero correctly", function () {
    expect(
      new Earth().getPrimeMeridianMeanSiderealTime(Constants.JULIAN_DAY_2000),
    ).toBeCloseTo(280.4606, 4);
  });
});
