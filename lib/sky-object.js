/**
 * @param {SkyObjectType} skyObjectType - type of the sky object
 * @param {string} name - name of the sky object
 */
export class SkyObject {
  constructor(skyObjectType, name) {
    this.skyObjectType = skyObjectType;
    this.name = name;
  }
}
