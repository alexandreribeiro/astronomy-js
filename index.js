import { JulianDateCalculator } from "./lib/time/julian-date-calculator.js";
import { AstronomicalCalculator } from "./lib/astronomical-calculator.js";
import { SOLAR_SYSTEM_OBJECTS_LIST } from "./lib/solar-system-objects/solar-system-objects-list.js";
import { Constants } from "./lib/constants.js";
import { ObserverLocation } from "./lib/coordinates/types/observer-location.js";

export class AstronomyJS {
  constructor() {
    this.skyObjects = [...SOLAR_SYSTEM_OBJECTS_LIST];
    this.observerLocation = null;
    this.julianDate = null;
    this.simulationDate = null;
  }

  /**
   * @param {number} latitude - latitude in degrees
   * @param {number} longitude - longitude in degrees
   * @returns {AstronomyJS} - initialized AstronomyJS instance
   */
  static initialize(latitude, longitude) {
    let astronomyJS = new AstronomyJS();
    astronomyJS.setLocation("Earth", latitude, longitude, 0);
    astronomyJS.setDate(new Date());
    return astronomyJS;
  }

  /**
   * @returns {number|null} - current Julian date or null if not set
   */
  getJulianDate() {
    return this.julianDate;
  }

  /**
   * @param {number} julianDate - new Julian date
   */
  setJulianDate(julianDate) {
    this.julianDate = julianDate;
  }

  /**
   * @returns {Date|null} - current simulation date or null if not set
   */
  getDate() {
    return this.simulationDate;
  }

  /**
   * @param {Date} newDate - new date
   */
  setDate(newDate) {
    this.simulationDate = newDate;
    this.setJulianDate(JulianDateCalculator.julianDate(newDate));
  }

  /**
   * @param {string} objectName - name of the object
   * @returns {SolarSystemObject|null} - solar system object or null if not found
   */
  getSkyObjectByName(objectName) {
    return (
      this.skyObjects.find((skyObject) => skyObject.name === objectName) || null
    );
  }

  /**
   * @param {string} objectName - name of the ephemeris type
   * @returns {object|null} - ephemeris type object or null if not found
   */
  getEphemerisTypeByName(objectName) {
    return (
      Object.values(Constants.EPHEMERIS_TYPE).find(
        (type) => type.NAME === objectName,
      ) || null
    );
  }

  /**
   * @param {string} objectName - name of the object to set location on
   * @param {number} latitude - latitude in degrees
   * @param {number} longitude - longitude in degrees
   * @param {number} elevationFromObjectSurface - elevation from surface in meters
   */
  setLocation(objectName, latitude, longitude, elevationFromObjectSurface) {
    const solarSystemObject = this.getSkyObjectByName(objectName);
    if (!solarSystemObject) {
      throw new Error(`Solar system object "${objectName}" not found`);
    }

    this.observerLocation = new ObserverLocation(
      longitude,
      latitude,
      elevationFromObjectSurface,
      solarSystemObject,
    );
  }

  /**
   * @param {string} objectName - name of the object
   * @param {Date} [referenceDate] - optional reference date
   * @returns {TopocentricEquatorialSphericalCoordinates} - Right Ascension and Declination coordinates
   */
  getRightAscensionDeclinationCoordinatesForObject(objectName, referenceDate) {
    const skyObject = this.getSkyObjectByName(objectName);
    if (!skyObject || this.julianDate === null) {
      throw new Error("Invalid object name or Julian date not set");
    }

    const julianReferenceDate = referenceDate
      ? JulianDateCalculator.julianDate(referenceDate)
      : this.julianDate;

    return AstronomicalCalculator.getTopocentricEquatorialSphericalCoordinates(
      this.observerLocation,
      skyObject,
      julianReferenceDate,
    );
  }

  /**
   * @param {string} objectName - name of the object
   * @param {Date} [referenceDate] - optional reference date
   * @returns {TopocentricEquatorialHourAngleDeclinationCoordinates} - Hour Angle and Declination coordinates
   */
  getHourAngleDeclinationCoordinatesForObject(objectName, referenceDate) {
    const skyObject = this.getSkyObjectByName(objectName);
    if (!skyObject || this.julianDate === null) {
      throw new Error("Invalid object name or Julian date not set");
    }

    const julianReferenceDate = referenceDate
      ? JulianDateCalculator.julianDate(referenceDate)
      : this.julianDate;

    return AstronomicalCalculator.getHADecCoordinatesForSolarSystemObject(
      this.observerLocation,
      skyObject,
      julianReferenceDate,
    );
  }

  /**
   * @param {string} objectName - name of the object
   * @param {Date} [referenceDate] - optional reference date
   * @returns {TopocentricHorizontalSphericalCoordinates} - Altitude and Azimuth coordinates
   */
  getAltitudeAzimuthCoordinatesForObject(objectName, referenceDate) {
    const skyObject = this.getSkyObjectByName(objectName);
    if (!skyObject) {
      throw new Error(`Object "${objectName}" not found`);
    }

    const julianReferenceDate = referenceDate
      ? JulianDateCalculator.julianDate(referenceDate)
      : this.julianDate;

    return AstronomicalCalculator.getTopocentricHorizontalSphericalCoordinatesForSolarSystemObject(
      this.observerLocation,
      skyObject,
      julianReferenceDate,
    );
  }

  /**
   * @param {string} objectName - name of the object
   * @param {Date} [referenceDate] - optional reference date
   * @returns {number} - fraction between 0 and 1 representing the illumination of the object
   */
  getIlluminatedFractionForObject(objectName, referenceDate) {
    const skyObject = this.getSkyObjectByName(objectName);
    if (!skyObject) {
      throw new Error(`Object "${objectName}" not found`);
    }

    const julianReferenceDate = referenceDate
      ? JulianDateCalculator.julianDate(referenceDate)
      : this.julianDate;

    return AstronomicalCalculator.getIlluminatedFractionForObject(
      this.observerLocation,
      skyObject,
      julianReferenceDate,
    );
  }

  /**
   * @returns {number} - local mean sidereal time in degrees
   */
  getLocalMeanSiderealTime() {
    if (this.julianDate === null) {
      throw new Error("Julian date not set");
    }
    return AstronomicalCalculator.getLocalMeanSiderealTime(
      this.observerLocation,
      this.julianDate,
    );
  }

  /**
   * @param {string} objectName - name of the object
   * @param {Date} referenceDate - reference date
   * @param {string} ephemerisTypeName - name of the ephemeris type
   * @returns {Date|null} - date of the ephemeris event or null if not found
   */
  getEphemerisDateForObject(objectName, referenceDate, ephemerisTypeName) {
    const solarSystemObject = this.getSkyObjectByName(objectName);
    const ephemerisType = this.getEphemerisTypeByName(ephemerisTypeName);

    if (!solarSystemObject || !ephemerisType) {
      throw new Error("Invalid object name or ephemeris type");
    }

    return AstronomicalCalculator.getDateForPositionalEphemeris(
      this.observerLocation,
      solarSystemObject,
      JulianDateCalculator.julianDate(referenceDate),
      ephemerisType,
    );
  }

  /**
   * @returns {ObserverLocation|null} - current observer location or null if not set
   */
  getObserverLocation() {
    return this.observerLocation;
  }

  /**
   * @returns {{latitude: number, longitude: number}|null} - current observer coordinates or null if not set
   */
  getLatitudeLongitudeCoordinates() {
    if (!this.observerLocation) {
      return null;
    }
    return {
      latitude: this.observerLocation.latitude,
      longitude: this.observerLocation.longitude,
    };
  }
}

/**
 * @param {number} latitude - latitude in degrees
 * @param {number} longitude - longitude in degrees
 * @returns {AstronomyJS} - initialized AstronomyJS instance
 */
export function initialize(latitude, longitude) {
  return AstronomyJS.initialize(latitude, longitude);
}
