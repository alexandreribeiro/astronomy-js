import { SkyObject } from "../sky-object.js";
import { SkyObjectType } from "../sky-object-type.js";

/**
 * @param {SkyObjectType} skyObjectType
 * @param {string} name
 * @param {OrbitalParameters} orbitalParameters
 * @param {number} meanRadius
 * @param {number} axialTilt
 */
export class DeepSkyObject extends SkyObject {
  constructor(skyObjectType, name, rightAscension, declination) {
    super(skyObjectType, name);
    this.rightAscension = rightAscension;
    this.declination = declination;
  }
}
