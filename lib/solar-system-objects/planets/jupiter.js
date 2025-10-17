import { SolarSystemObject } from "../solar-system-object";
import { OrbitalParameters } from "../orbital-parameters";
import { SkyObjectType } from "../../sky-object-type.js";

export class Jupiter extends SolarSystemObject {
  constructor() {
    const orbitalParameters = new OrbitalParameters(
      5.20336301,
      0.04839266,
      1.3053,
      100.55615,
      14.75385,
      34.40438,
      0.00060737,
      -0.0001288,
      -4.15,
      1217.17,
      839.93,
      10925078.35,
    );
    super(SkyObjectType.PLANET, "Jupiter", orbitalParameters, 69911000, 3.13);
  }
}
