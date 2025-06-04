import { AstronomicalCalculator } from "./lib/astronomical-calculator.js";
import { SOLAR_SYSTEM_OBJECTS_LIST } from "./lib/solar-system-objects/solar-system-objects-list";

declare module "astronomy-js" {

  export class AstronomyJS {
    skyObjects: typeof SOLAR_SYSTEM_OBJECTS_LIST;
    astronomicalCalculator: AstronomicalCalculator;
    julianDate: number | null;
    date: Date | null;

    constructor();

    getJulianDate(): number | null;

    setJulianDate(newJulianDate: number): void;

    getDate(): Date | null;

    setDate(newDate: Date): void;

    getSkyObjectByName(objectName: string): any | null;

    getEphemerisTypeByName(objectName: string): any | null;

    setLocation(
      objectName: string,
      latitude: number,
      longitude: number,
      elevationFromObjectSurface: number
    ): void;

    static initialize(latitude: number, longitude: number): AstronomyJS;

    getRADecCoordinatesForObject(objectName: string): any;

    getHADecCoordinatesForObject(objectName: string): any;

    getAltAzCoordinatesForObject(objectName: string, referenceDate?: Date): any;

    getEphemerisDateForObject(
      objectName: string,
      referenceDate: Date,
      ephemerisTypeName: string
    ): any;
  }

  export function initialize(latitude: number, longitude: number): AstronomyJS;
}
