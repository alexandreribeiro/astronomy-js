import { AngleCalculator } from "../angle-calculator.js";
import { Constants } from "../constants.js";

export class OrbitalParameters {
  /**
   * @constructor
   * @param {number} a0 - semi-major axis (AU)
   * @param {number} e0 - eccentricity
   * @param {number} i0 - inclination (degrees)
   * @param {number} o0 - longitude of the ascending node (degrees)
   * @param {number} w0 - longitude of perihelion (degrees)
   * @param {number} l0 - mean longitude (degrees)
   * @param {number} ac - semi-major axis centennial rate (AU per Julian century)
   * @param {number} ec - eccentricity (per Julian century)
   * @param {number} ic - inclination (arc seconds per Julian century)
   * @param {number} oc - longitude of the ascending node (arc seconds per Julian century)
   * @param {number} wc - longitude of perihelion (arc seconds per Julian century)
   * @param {number} lc - mean longitude (arc seconds per Julian century)
   */
  constructor(a0, e0, i0, o0, w0, l0, ac, ec, ic, oc, wc, lc) {
    this.a0 = a0;
    this.e0 = e0;
    this.i0 = i0;
    this.o0 = o0;
    this.w0 = w0;
    this.l0 = l0;
    this.ac = ac;
    this.ec = ec;
    this.ic = ic;
    this.oc = oc;
    this.wc = wc;
    this.lc = lc;
  }

  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - semi-major axis in AU
   */
  getSemiMajorAxis(julianCenturiesSinceEpoch2000) {
    return this.a0 + this.ac * julianCenturiesSinceEpoch2000;
  }

  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - eccentricity
   */
  getEccentricity(julianCenturiesSinceEpoch2000) {
    return this.e0 + this.ec * julianCenturiesSinceEpoch2000;
  }

  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - inclination in degrees
   */
  getInclination(julianCenturiesSinceEpoch2000) {
    return AngleCalculator.modDegrees(
      this.i0 + (this.ic / 3600) * julianCenturiesSinceEpoch2000,
    );
  }

  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - longitude of the ascending node in degrees
   */
  getAscendingNode(julianCenturiesSinceEpoch2000) {
    return AngleCalculator.modDegrees(
      this.o0 + (this.oc / 3600) * julianCenturiesSinceEpoch2000,
    );
  }

  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - longitude of perihelion in degrees
   */
  getPerihelion(julianCenturiesSinceEpoch2000) {
    return AngleCalculator.modDegrees(
      this.w0 + (this.wc / 3600) * julianCenturiesSinceEpoch2000,
    );
  }

  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - mean longitude in degrees
   */
  getMeanLongitude(julianCenturiesSinceEpoch2000) {
    return AngleCalculator.modDegrees(
      this.l0 + (this.lc / 3600) * julianCenturiesSinceEpoch2000,
    );
  }

  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - mean anomaly in degrees
   */
  getMeanAnomaly(julianCenturiesSinceEpoch2000) {
    return AngleCalculator.modDegrees(
      this.getMeanLongitude(julianCenturiesSinceEpoch2000) -
        this.getPerihelion(julianCenturiesSinceEpoch2000),
    );
  }

  /**
   *
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - eccentric anomaly in degrees
   */
  getEccentricAnomaly(julianCenturiesSinceEpoch2000) {
    const meanAnomalyInRadians = AngleCalculator.degreesToRadians(
      this.getMeanAnomaly(julianCenturiesSinceEpoch2000),
    );
    const eccentricity = this.getEccentricity(julianCenturiesSinceEpoch2000);

    let PREVIOUS_E =
      meanAnomalyInRadians +
      eccentricity *
        Math.sin(meanAnomalyInRadians) *
        (1.0 + eccentricity * Math.cos(meanAnomalyInRadians));
    let E = 0;
    let dE = 0;
    let loopCount = 0;
    while (loopCount++ < 10000) {
      E =
        PREVIOUS_E -
        (PREVIOUS_E -
          eccentricity * Math.sin(PREVIOUS_E) -
          meanAnomalyInRadians) /
          (1 - eccentricity * Math.cos(PREVIOUS_E));
      dE = E - PREVIOUS_E;
      PREVIOUS_E = E;
      if (Math.abs(dE) <= Constants.EPS) {
        break;
      }
    }
    return AngleCalculator.radiansToDegrees(E);
  }

  /**
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - true anomaly in degrees
   */
  getTrueAnomaly(julianCenturiesSinceEpoch2000) {
    const eccentricity = this.getEccentricity(julianCenturiesSinceEpoch2000);
    const eccentricAnomaly = AngleCalculator.degreesToRadians(
      this.getEccentricAnomaly(julianCenturiesSinceEpoch2000),
    );
    const trueAnomaly =
      2 *
      Math.atan(
        Math.sqrt((1 + eccentricity) / (1 - eccentricity)) *
          Math.tan(0.5 * eccentricAnomaly),
      );
    return AngleCalculator.radiansToDegrees(trueAnomaly);
  }

  /**
   * R = (a * (1 - e^2)) / (1 + e * cos(V))
   * @param {number} julianCenturiesSinceEpoch2000 - Julian centuries since J2000.0
   * @returns {number} - orbit radius in AU
   */
  getOrbitRadius(julianCenturiesSinceEpoch2000) {
    const semiMajorAxis = this.getSemiMajorAxis(julianCenturiesSinceEpoch2000);
    const eccentricity = this.getEccentricity(julianCenturiesSinceEpoch2000);
    const trueAnomaly = this.getTrueAnomaly(julianCenturiesSinceEpoch2000);
    return (
      (semiMajorAxis * (1 - Math.pow(eccentricity, 2))) /
      (1 +
        eccentricity * Math.cos(AngleCalculator.degreesToRadians(trueAnomaly)))
    );
  }
}
