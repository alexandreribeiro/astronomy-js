import { TimeHelper } from "./lib/time-helper.js";
import { AstronomicalCalculator } from "./lib/astronomical-calculator.js";
import { SphericalCoordinates } from "./lib/coordinates/spherical-coordinates.js";
import { SOLAR_SYSTEM_OBJECTS_LIST } from "./lib/solar-system-objects/solar-system-objects-list.js";
import { Constants } from "./lib/constants.js";

class AstronomyJS {
  constructor() {
    this.skyObjects = [...SOLAR_SYSTEM_OBJECTS_LIST];
    this.astronomicalCalculator = new AstronomicalCalculator();
    this.julianDate = null;
    this.date = null;
  }

  getJulianDate() {
    return this.julianDate;
  }

  setJulianDate(newJulianDate) {
    this.julianDate = newJulianDate;
  }

  getDate() {
    return this.date;
  }

  setDate(newDate) {
    this.date = newDate;
    this.setJulianDate(TimeHelper.julianDate(newDate));
  }

  getSkyObjectByName(objectName) {
    return this.skyObjects.find((obj) => obj.name === objectName) || null;
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

    this.astronomicalCalculator = new AstronomicalCalculator(
      new SphericalCoordinates(
        latitude,
        longitude,
        solarSystemObject.meanRadius + elevationFromObjectSurface,
      ),
      solarSystemObject,
    );
  }

  getRADecCoordinatesForObject(objectName) {
    const skyObject = this.getSkyObjectByName(objectName);
    if (!skyObject || this.julianDate === null) {
      throw new Error("Invalid object name or Julian date not set");
    }
    return this.astronomicalCalculator.getRADecCoordinatesForSolarSystemObject(
      skyObject,
      this.julianDate,
    );
  }

  getHADecCoordinatesForObject(objectName) {
    const skyObject = this.getSkyObjectByName(objectName);
    if (!skyObject || this.julianDate === null) {
      throw new Error("Invalid object name or Julian date not set");
    }
    return this.astronomicalCalculator.getHADecCoordinatesForSolarSystemObject(
      skyObject,
      this.julianDate,
    );
  }

  getAltAzCoordinatesForObject(objectName, referenceDate) {
    const skyObject = this.getSkyObjectByName(objectName);
    if (!skyObject) {
      throw new Error(`Object "${objectName}" not found`);
    }

    const julianReferenceDate = referenceDate
      ? TimeHelper.julianDate(referenceDate)
      : this.julianDate;

    if (julianReferenceDate === null) {
      throw new Error("Reference date not set");
    }

    const equatorialCoordinates =
      this.astronomicalCalculator.getRADecCoordinatesForSolarSystemObject(
        skyObject,
        julianReferenceDate,
      );

    return this.astronomicalCalculator.getAltAzCoordinatesForEquatorialCoordinates(
      equatorialCoordinates,
      julianReferenceDate,
    );
  }

  initialize(latitude, longitude) {
    let astronomyJS = new AstronomyJS();
    astronomyJS.setLocation("Earth", latitude, longitude, 0);
    astronomyJS.setDate(new Date());
    return astronomyJS;
  }

  getEphemerisDateForObject(objectName, referenceDate, ephemerisTypeName) {
    const solarSystemObject = this.getSkyObjectByName(objectName);
    const ephemerisType = this.getEphemerisTypeByName(ephemerisTypeName);

    if (!solarSystemObject || !ephemerisType) {
      throw new Error("Invalid object name or ephemeris type");
    }

    return this.astronomicalCalculator.getDateForPositionalEphemeris(
      solarSystemObject,
      TimeHelper.julianDate(referenceDate),
      ephemerisType,
    );
  }
}

export function initialize(latitude, longitude) {
  let astronomyJS = new AstronomyJS();
  astronomyJS.setLocation("Earth", latitude, longitude, 0);
  astronomyJS.setDate(new Date());
  return astronomyJS;
}
