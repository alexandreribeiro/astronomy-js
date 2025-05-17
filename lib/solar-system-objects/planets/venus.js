import { SolarSystemObject } from "../solar-system-object";
import { OrbitalParameters } from "../orbital-parameters";

export class Venus extends SolarSystemObject {
  constructor() {
    const orbitalParameters = new OrbitalParameters(
      0.72333199,
      0.00677323,
      3.39471,
      76.68069,
      131.53298,
      181.97973,
      0.00000092,
      -0.00004938,
      -2.86,
      -996.89,
      -108.8,
      210664136.06,
    );
    super("Venus", orbitalParameters, 6051800, 2.64);
  }
}
