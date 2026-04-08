import { SkyObject } from "../sky-object.js";
import { EclipticRectangularCoordinates } from "../coordinates/types/ecliptic-rectangular-coordinates.js";
import { JulianDateCalculator } from "../time/julian-date-calculator.js";
import { AngleCalculator } from "../angle-calculator.js";
import { SkyObjectType } from "../sky-object-type.js";

/**
 * @param {SkyObjectType} skyObjectType - type of the sky object
 * @param {string} name - name of the sky object
 * @param {OrbitalParameters} orbitalParameters - orbital parameters of the object
 * @param {number} meanRadius - mean radius in meters
 * @param {number} axialTilt - axial tilt in degrees
 */
export class SolarSystemObject extends SkyObject {
  constructor(
    skyObjectType,
    name,
    orbitalParameters,
    meanRadius,
    axialTilt,
    flattening,
  ) {
    super(skyObjectType, name);
    this.orbitalParameters = orbitalParameters;
    this.meanRadius = meanRadius;
    this.axialTilt = axialTilt;
    this.flattening = flattening;
  }

  /**
   * @param {OrbitalParameters} orbitalParameters - orbital parameters
   * @param {number} julianDate - Julian date
   * @returns {EclipticRectangularCoordinates} - rectangular heliocentric coordinates
   */
  static getRectangularHeliocentricCoordinatesFromOrbitalParameters(
    orbitalParameters,
    julianDate,
  ) {
    const julianCenturiesSinceEpoch2000 =
      JulianDateCalculator.julianCenturiesSinceEpoch2000(julianDate);
    const i = AngleCalculator.degreesToRadians(
      orbitalParameters.getInclination(julianCenturiesSinceEpoch2000),
    );
    const V = AngleCalculator.degreesToRadians(
      orbitalParameters.getTrueAnomaly(julianCenturiesSinceEpoch2000),
    );
    const w = AngleCalculator.degreesToRadians(
      orbitalParameters.getPerihelion(julianCenturiesSinceEpoch2000),
    );
    const O = AngleCalculator.degreesToRadians(
      orbitalParameters.getAscendingNode(julianCenturiesSinceEpoch2000),
    );
    const R = orbitalParameters.getOrbitRadius(julianCenturiesSinceEpoch2000);
    const VwO = V + w - O;

    const XH =
      R *
      (Math.cos(O) * Math.cos(VwO) - Math.sin(O) * Math.sin(VwO) * Math.cos(i));
    const YH =
      R *
      (Math.sin(O) * Math.cos(VwO) + Math.cos(O) * Math.sin(VwO) * Math.cos(i));
    const ZH = R * (Math.sin(VwO) * Math.sin(i));

    return new EclipticRectangularCoordinates(XH, YH, ZH, null);
  }

  /**
   * @param {number} julianDate - Julian date
   * @returns {EclipticRectangularCoordinates} - rectangular heliocentric coordinates
   */
  getRectangularHeliocentricCoordinates(julianDate) {
    return SolarSystemObject.getRectangularHeliocentricCoordinatesFromOrbitalParameters(
      this.orbitalParameters,
      julianDate,
    );
  }

  getObliquity(julianDate) {
    return this.axialTilt;
  }

  getPrimeMeridianMeanSiderealTime(julianDate) {
    throw new Error("Not implemented");
  }
}
