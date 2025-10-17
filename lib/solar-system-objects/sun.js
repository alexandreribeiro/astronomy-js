import { SolarSystemObject } from "./solar-system-object";
import { RectangularCoordinates } from "../coordinates/rectangular-coordinates";
import { SkyObjectType } from "../sky-object-type.js";

export class Sun extends SolarSystemObject {
  constructor() {
    super(SkyObjectType.STAR, "Sun", null, 695508000, 0);
  }

  getRectangularHeliocentricCoordinates(julianDate) {
    return new RectangularCoordinates(0, 0, 0);
  }
}
