import { SolarSystemObject } from "../solar-system-object";
import { OrbitalParameters } from "../orbital-parameters";
import { SkyObjectType } from "../../sky-object-type.js";

export class Saturn extends SolarSystemObject {
  constructor() {
    const orbitalParameters = new OrbitalParameters(
      9.53707032,
      0.0541506,
      2.48446,
      113.71504,
      92.43194,
      49.94432,
      -0.0030153,
      -0.00036762,
      6.11,
      -1591.05,
      -1948.89,
      4401052.95,
    );
    super(SkyObjectType.PLANET, "Saturn", orbitalParameters, 58232000, 26.73);
  }
}
