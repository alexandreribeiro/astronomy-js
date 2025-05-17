import { MathHelper } from "../math-helper";
import { Constants } from "../constants";

export class OrbitalParameters {
  /**
   * @constructor
   * @param a0 semi-major axis (AU)
   * @param e0 eccentricity
   * @param i0 inclination (degrees)
   * @param o0 longitude of the ascending node (degrees)
   * @param w0 longitude of perihelion (degrees)
   * @param l0 mean longitude (degrees)
   * @param ac semi-major axis centennial rate (AU per Julian century)
   * @param ec eccentricity (per Julian century)
   * @param ic inclination (arc seconds per Julian century)
   * @param oc longitude of the ascending node (arc seconds per Julian century)
   * @param wc longitude of perihelion (arc seconds per Julian century)
   * @param lc mean longitude (arc seconds per Julian century)
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
   * @param julianCenturiesSinceEpoch2000
   * @returns a - semi major axis
   */
  getSemiMajorAxis(julianCenturiesSinceEpoch2000) {
    return this.a0 + this.ac * julianCenturiesSinceEpoch2000;
  }

  /**
   * @param julianCenturiesSinceEpoch2000
   * @returns e - eccentricity
   */
  getEccentricity(julianCenturiesSinceEpoch2000) {
    return this.e0 + this.ec * julianCenturiesSinceEpoch2000;
  }

  getInclination(julianCenturiesSinceEpoch2000) {
    return MathHelper.modDegrees(
      this.i0 + (this.ic / 3600) * julianCenturiesSinceEpoch2000,
    );
  }

  getAscendingNode(julianCenturiesSinceEpoch2000) {
    return MathHelper.modDegrees(
      this.o0 + (this.oc / 3600) * julianCenturiesSinceEpoch2000,
    );
  }

  getPerihelion(julianCenturiesSinceEpoch2000) {
    return MathHelper.modDegrees(
      this.w0 + (this.wc / 3600) * julianCenturiesSinceEpoch2000,
    );
  }

  getMeanLongitude(julianCenturiesSinceEpoch2000) {
    return MathHelper.modDegrees(
      this.l0 + (this.lc / 3600) * julianCenturiesSinceEpoch2000,
    );
  }

  getMeanAnomaly(julianCenturiesSinceEpoch2000) {
    return MathHelper.modDegrees(
      this.getMeanLongitude(julianCenturiesSinceEpoch2000) -
        this.getPerihelion(julianCenturiesSinceEpoch2000),
    );
  }

  /**
   *
   * @param julianCenturiesSinceEpoch2000
   * @returns {*} E: eccentric anomaly
   */
  getEccentricAnomaly(julianCenturiesSinceEpoch2000) {
    const meanAnomalyInRadians = MathHelper.degreesToRadians(
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
    return MathHelper.radiansToDegrees(E);
  }

  /**
   * @param julianCenturiesSinceEpoch2000
   * @returns V: true anomaly
   */
  getTrueAnomaly(julianCenturiesSinceEpoch2000) {
    const eccentricity = this.getEccentricity(julianCenturiesSinceEpoch2000);
    const eccentricAnomaly = MathHelper.degreesToRadians(
      this.getEccentricAnomaly(julianCenturiesSinceEpoch2000),
    );
    const trueAnomaly =
      2 *
      Math.atan(
        Math.sqrt((1 + eccentricity) / (1 - eccentricity)) *
          Math.tan(0.5 * eccentricAnomaly),
      );
    return MathHelper.radiansToDegrees(trueAnomaly);
  }

  /**
   * R = (a * (1 - e^2)) / (1 + e * cos(V))
   * @param julianCenturiesSinceEpoch2000
   * @returns R: orbit radius
   */
  getOrbitRadius(julianCenturiesSinceEpoch2000) {
    const semiMajorAxis = this.getSemiMajorAxis(julianCenturiesSinceEpoch2000);
    const eccentricity = this.getEccentricity(julianCenturiesSinceEpoch2000);
    const trueAnomaly = this.getTrueAnomaly(julianCenturiesSinceEpoch2000);
    return (
      (semiMajorAxis * (1 - Math.pow(eccentricity, 2))) /
      (1 + eccentricity * Math.cos(MathHelper.degreesToRadians(trueAnomaly)))
    );
  }
}
