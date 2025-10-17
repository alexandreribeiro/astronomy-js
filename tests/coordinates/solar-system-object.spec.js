import { OrbitalParameters } from "../../lib/solar-system-objects/orbital-parameters";
import { SolarSystemObject } from "../../lib/solar-system-objects/solar-system-object";
import { Constants } from "../../lib/constants";
import { Earth } from "../../lib/solar-system-objects/planets/earth.js";
import { SkyObjectType } from "../../lib/sky-object-type.js";
import { SkyObject } from "../../lib/sky-object.js";

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
  const dummySolarSystemObject = new SolarSystemObject(
    SkyObjectType.PLANET,
    "dummy",
    orbitalParameters,
    1000,
    10,
  );

  it("should calculate Dummy rectangular heliocentric coordinates in epoch day zero correctly", function () {
    const rectangularHeliocentricCoordinates =
      dummySolarSystemObject.getRectangularHeliocentricCoordinates(
        Constants.JULIAN_DAY_2000,
      );
    expect(rectangularHeliocentricCoordinates.x).toBeCloseTo(1.391, 3);
    expect(rectangularHeliocentricCoordinates.y).toBeCloseTo(-0.013, 3);
    expect(rectangularHeliocentricCoordinates.z).toBeCloseTo(-0.034, 3);
    expect(rectangularHeliocentricCoordinates.center).toStrictEqual(
      new SkyObject(SkyObjectType.STAR, "Sun"),
    );
  });

  it("should calculate Earth's rectangular heliocentric coordinates in epoch day zero correctly", function () {
    const rectangularHeliocentricCoordinates =
      new Earth().getRectangularHeliocentricCoordinates(
        Constants.JULIAN_DAY_2000,
      );
    expect(rectangularHeliocentricCoordinates.x).toBeCloseTo(-0.177, 3);
    expect(rectangularHeliocentricCoordinates.y).toBeCloseTo(0.967, 3);
    expect(rectangularHeliocentricCoordinates.z).toBeCloseTo(-0.0, 3);
    expect(rectangularHeliocentricCoordinates.center).toStrictEqual(
      new SkyObject(SkyObjectType.STAR, "Sun"),
    );
  });
});
