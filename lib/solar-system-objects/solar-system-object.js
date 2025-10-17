import { SkyObject } from "../sky-object";
import { RectangularCoordinates } from "../coordinates/rectangular-coordinates";
import { TimeHelper } from "../time-helper";
import { MathHelper } from "../math-helper";
import { SkyObjectType } from "../sky-object-type.js";

/**
 * @param {SkyObjectType} skyObjectType
 * @param {string} name
 * @param {OrbitalParameters} orbitalParameters
 * @param {number} meanRadius
 * @param {number} axialTilt
 */
export class SolarSystemObject extends SkyObject {
  constructor(skyObjectType, name, orbitalParameters, meanRadius, axialTilt) {
    super(skyObjectType, name);
    this.orbitalParameters = orbitalParameters;
    this.meanRadius = meanRadius;
    this.axialTilt = axialTilt;
  }

  /**
   * @param julianDate
   * @returns {RectangularCoordinates}
   */
  getRectangularHeliocentricCoordinates(julianDate) {
    const julianCenturiesSinceEpoch2000 =
      TimeHelper.julianCenturiesSinceEpoch2000(julianDate);
    const i = MathHelper.degreesToRadians(
      this.orbitalParameters.getInclination(julianCenturiesSinceEpoch2000),
    );
    const V = MathHelper.degreesToRadians(
      this.orbitalParameters.getTrueAnomaly(julianCenturiesSinceEpoch2000),
    );
    const w = MathHelper.degreesToRadians(
      this.orbitalParameters.getPerihelion(julianCenturiesSinceEpoch2000),
    );
    const O = MathHelper.degreesToRadians(
      this.orbitalParameters.getAscendingNode(julianCenturiesSinceEpoch2000),
    );
    const R = this.orbitalParameters.getOrbitRadius(
      julianCenturiesSinceEpoch2000,
    );
    const VwO = V + w - O;

    const XH =
      R *
      (Math.cos(O) * Math.cos(VwO) - Math.sin(O) * Math.sin(VwO) * Math.cos(i));
    const YH =
      R *
      (Math.sin(O) * Math.cos(VwO) + Math.cos(O) * Math.sin(VwO) * Math.cos(i));
    const ZH = R * (Math.sin(VwO) * Math.sin(i));

    return new RectangularCoordinates(XH, YH, ZH);
  }
}
