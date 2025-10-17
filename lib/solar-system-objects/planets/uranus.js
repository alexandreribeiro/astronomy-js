import { SolarSystemObject } from "../solar-system-object";
import { OrbitalParameters } from "../orbital-parameters";
import { SkyObjectType } from "../../sky-object-type.js";

export class Uranus extends SolarSystemObject {
  constructor() {
    const orbitalParameters = new OrbitalParameters(
      19.19126393,
      0.04716771,
      0.76986,
      74.22988,
      170.96424,
      313.23218,
      0.00152025,
      -0.0001915,
      -2.09,
      -1681.4,
      1312.56,
      1542547.79,
    );
    super(SkyObjectType.PLANET, "Uranus", orbitalParameters, 25362000, 97.77);
  }
}
