import { SkyObject } from "../sky-object.js";
import { SkyObjectType } from "../sky-object-type.js";

/**
 * @param {SkyObjectType} skyObjectType - type of the sky object
 * @param {string} name - name of the sky object
 * @param {OrbitalParameters} orbitalParameters - orbital parameters
 * @param {number} meanRadius - mean radius in meters
 * @param {number} axialTilt - axial tilt in degrees
 */
export class DeepSkyObject extends SkyObject {
  constructor(skyObjectType, name, rightAscension, declination) {
    super(skyObjectType, name);
    this.rightAscension = rightAscension;
    this.declination = declination;
  }
}
