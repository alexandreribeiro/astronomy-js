import { SolarSystemObject } from "../solar-system-object";
import { OrbitalParameters } from "../orbital-parameters";
import { SkyObjectType } from "../../sky-object-type.js";

export class Mars extends SolarSystemObject {
  constructor() {
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
    super(SkyObjectType.PLANET, "Mars", orbitalParameters, 3389500, 25.19);
  }
}
