import { SolarSystemObject } from "../solar-system-object";
import { OrbitalParameters } from "../orbital-parameters";
import { SkyObjectType } from "../../sky-object-type.js";

export class Neptune extends SolarSystemObject {
  constructor() {
    const orbitalParameters = new OrbitalParameters(
      30.06896348,
      0.00858587,
      1.76917,
      131.72169,
      44.97135,
      304.88003,
      -0.00125196,
      0.0000251,
      -3.64,
      -151.25,
      -844.43,
      786449.21,
    );
    super(SkyObjectType.PLANET, "Neptune", orbitalParameters, 24622000, 28.32);
  }
}
