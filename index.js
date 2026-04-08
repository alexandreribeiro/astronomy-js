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

  static initialize(latitude, longitude) {
    let astronomyJS = new AstronomyJS();
    astronomyJS.setLocation("Earth", latitude, longitude, 0);
    astronomyJS.setDate(new Date());
    return astronomyJS;
  }

  getJulianDate() {
    return this.julianDate;
  }

  setJulianDate(newJulianDate) {
    this.julianDate = newJulianDate;
  }

  getDate() {
    return this.simulationDate;
  }

  setDate(newDate) {
    this.simulationDate = newDate;
    this.setJulianDate(JulianDateCalculator.julianDate(newDate));
  }

  getSkyObjectByName(objectName) {
    return (
      this.skyObjects.find((skyObject) => skyObject.name === objectName) || null
    );
  }

  getEphemerisTypeByName(objectName) {
    return (
      Object.values(Constants.EPHEMERIS_TYPE).find(
        (type) => type.NAME === objectName,
      ) || null
    );
  }

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

  getLatitudeLongitudeCoordinates() {
    return {
      latitude: this.observerLocation.latitude,
      longitude: this.observerLocation.longitude,
    };
  }

  getRADecCoordinatesForObject(objectName) {
    const skyObject = this.getSkyObjectByName(objectName);
    if (!skyObject || this.julianDate === null) {
      throw new Error("Invalid object name or Julian date not set");
    }
    return AstronomicalCalculator.getTopocentricEquatorialSphericalCoordinates(
      this.observerLocation,
      skyObject,
      this.julianDate,
    );
  }

  getHADecCoordinatesForObject(objectName) {
    const skyObject = this.getSkyObjectByName(objectName);
    if (!skyObject || this.julianDate === null) {
      throw new Error("Invalid object name or Julian date not set");
    }
    return AstronomicalCalculator.getHADecCoordinatesForSolarSystemObject(
      this.observerLocation,
      skyObject,
      this.julianDate,
    );
  }

  getLocalMeanSiderealTime() {
    if (this.julianDate === null) {
      throw new Error("Julian date not set");
    }
    return AstronomicalCalculator.getLocalMeanSiderealTime(
      this.observerLocation,
      this.julianDate,
    );
  }

  getAltAzCoordinatesForObject(objectName, referenceDate) {
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

  getObserverLocation() {
    return this.observerLocation;
  }
}

export function initialize(latitude, longitude) {
  return AstronomyJS.initialize(latitude, longitude);
}
