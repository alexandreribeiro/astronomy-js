import { SolarSystemObject } from "../solar-system-object";
import { OrbitalParameters } from "../orbital-parameters";

export class Mercury extends SolarSystemObject {
  constructor() {
    const orbitalParameters = new OrbitalParameters(
      0.38709893,
      0.20563069,
      7.00487,
      48.33167,
      77.45645,
      252.25084,
      0.00000066,
      0.00002527,
      -23.51,
      -446.3,
      573.57,
      538101628.29,
    );
    super("Mercury", orbitalParameters, 2439700, 2.04);
  }
}
