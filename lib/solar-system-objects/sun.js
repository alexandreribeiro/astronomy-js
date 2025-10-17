import { SolarSystemObject } from "./solar-system-object";
import { EclipticRectangularCoordinates } from "../coordinates/ecliptic-rectangular-coordinates.js";
import { SkyObjectType } from "../sky-object-type.js";

export class Sun extends SolarSystemObject {
  constructor() {
    super(SkyObjectType.STAR, "Sun", null, 695508000, 0);
  }

  getRectangularHeliocentricCoordinates(julianDate) {
    return new EclipticRectangularCoordinates(0, 0, 0, new Sun());
  }
}
