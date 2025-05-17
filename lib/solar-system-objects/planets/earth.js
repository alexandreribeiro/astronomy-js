import { SolarSystemObject } from "../solar-system-object";
import { OrbitalParameters } from "../orbital-parameters";

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
    super("Earth", orbitalParameters, 6371000, 23.439281);
  }
}
