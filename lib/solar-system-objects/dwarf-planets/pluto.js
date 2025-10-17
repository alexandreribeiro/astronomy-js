import { SolarSystemObject } from "../solar-system-object";
import { OrbitalParameters } from "../orbital-parameters";
import { SkyObjectType } from "../../sky-object-type.js";

export class Pluto extends SolarSystemObject {
  constructor() {
    const orbitalParameters = new OrbitalParameters(
      39.48168677,
      0.24880766,
      17.14175,
      110.30347,
      113.76329,
      238.92881,
      -0.0000000207,
      0.00006465,
      0.00000501,
      -37.033,
      7.765,
      145.2078,
    );
    super(SkyObjectType.PLANET, "Pluto", orbitalParameters, 1188300, 122.53);
  }
}
