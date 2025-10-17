import { OrbitalParameters } from "../../lib/solar-system-objects/orbital-parameters";
import { SolarSystemObject } from "../../lib/solar-system-objects/solar-system-object";
import { Constants } from "../../lib/constants";
import { SkyObjectType } from "../../lib/sky-object-type.js";

describe("SolarSystemObject", function () {
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
  const solarSystemObject = new SolarSystemObject(
    SkyObjectType.PLANET,
    "dummy",
    orbitalParameters,
  );

  it("should calculate rectangular heliocentric coordinates in epoch day zero correctly", function () {
    const rectangularHeliocentricCoordinates =
      solarSystemObject.getRectangularHeliocentricCoordinates(
        Constants.JULIAN_DAY_2000,
      );
    expect(rectangularHeliocentricCoordinates.x).toBeCloseTo(1.391, 3);
    expect(rectangularHeliocentricCoordinates.y).toBeCloseTo(-0.013, 3);
    expect(rectangularHeliocentricCoordinates.z).toBeCloseTo(-0.034, 3);
  });
});
