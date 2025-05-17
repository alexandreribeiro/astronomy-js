import { OrbitalParameters } from "../../lib/solar-system-objects/orbital-parameters";
import { TimeHelper } from "../../lib/time-helper";
import { Constants } from "../../lib/constants";

describe("OrbitalParameters", function () {
  const orbitalParameters = new OrbitalParameters(
    1.52366231,
    0.09341233,
    1.85061,
    49.57854,
    336.04084,
    355.45332,
    -0.00007221,
    0.00011902,
    -25.47,
    -1020.19,
    1560.78,
    68905103.78,
  );
  const julianCenturiesSinceEpoch2000 =
    TimeHelper.julianCenturiesSinceEpoch2000(Constants.JULIAN_DAY_2000);
  const julianCenturiesSinceEpoch2010 =
    TimeHelper.julianCenturiesSinceEpoch2000(Constants.JULIAN_DAY_2010);

  it("should calculate ascending node longitude in epoch day zero correctly", function () {
    expect(
      orbitalParameters.getAscendingNode(julianCenturiesSinceEpoch2000),
    ).toBe(49.57854);
  });
  it("should calculate ascending node longitude in epoch day zero plus one decade correctly", function () {
    expect(
      orbitalParameters.getAscendingNode(julianCenturiesSinceEpoch2010),
    ).toBeCloseTo(49.5502, 5);
  });
  it("should calculate mean anomaly in epoch day zero correctly", function () {
    expect(
      orbitalParameters.getMeanAnomaly(julianCenturiesSinceEpoch2000),
    ).toBeCloseTo(19.41248, 5);
  });
  it("should calculate mean anomaly in epoch day zero plus one decade correctly", function () {
    expect(
      orbitalParameters.getMeanAnomaly(julianCenturiesSinceEpoch2010),
    ).toBeCloseTo(133.39979, 5);
  });
  it("should calculate eccentric anomaly in epoch day zero correctly", function () {
    expect(
      orbitalParameters.getEccentricAnomaly(julianCenturiesSinceEpoch2000),
    ).toBeCloseTo(21.36205, 5);
  });
  it("should calculate eccentric anomaly in epoch day zero plus one decade correctly", function () {
    expect(
      orbitalParameters.getEccentricAnomaly(julianCenturiesSinceEpoch2010),
    ).toBeCloseTo(137.047, 3);
  });
  it("should calculate true anomaly in epoch day zero correctly", function () {
    expect(
      orbitalParameters.getTrueAnomaly(julianCenturiesSinceEpoch2000),
    ).toBeCloseTo(23.40473, 5);
  });
  it("should calculate true anomaly in epoch day zero plus one decade correctly", function () {
    expect(
      orbitalParameters.getTrueAnomaly(julianCenturiesSinceEpoch2010),
    ).toBeCloseTo(140.58033, 5);
  });
  it("should calculate orbit radius in epoch day zero correctly", function () {
    expect(
      orbitalParameters.getOrbitRadius(julianCenturiesSinceEpoch2000),
    ).toBeCloseTo(1.391, 3);
  });
});
