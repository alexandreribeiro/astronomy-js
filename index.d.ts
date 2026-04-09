import { AstronomicalCalculator } from "./lib/astronomical-calculator.js";
import { SOLAR_SYSTEM_OBJECTS_LIST } from "./lib/solar-system-objects/solar-system-objects-list.js";

declare module "astronomy-js" {
  export interface EphemerisType {
    NAME: string;
    ALTITUDE: string | null;
    IS_GOING_UP: boolean | null;
  }

  export interface SolarSystemObject {
    name: string;
    meanRadius: number;
    axialTilt: number;
    flattening?: number;
  }

  export interface ObserverLocation {
    longitude: number;
    latitude: number;
    elevation: number;
    center: SolarSystemObject;
  }

  export interface TopocentricEquatorialSphericalCoordinates {
    rightAscension: number;
    declination: number;
    distance: number;
    observerLocation: ObserverLocation;
  }

  export interface TopocentricEquatorialHourAngleDeclinationCoordinates {
    hourAngle: number;
    declination: number;
    distance: number;
  }

  export interface TopocentricHorizontalSphericalCoordinates {
    azimuth: number;
    altitude: number;
    distance: number;
    observerLocation: ObserverLocation;
  }

  export class AstronomyJS {
    skyObjects: typeof SOLAR_SYSTEM_OBJECTS_LIST;
    astronomicalCalculator: AstronomicalCalculator;
    julianDate: number | null;
    simulationDate: Date | null;
    observerLocation: ObserverLocation | null;

    constructor();

    static initialize(latitude: number, longitude: number): AstronomyJS;

    getJulianDate(): number | null;

    setJulianDate(julianDate: number): void;

    getDate(): Date | null;

    setDate(newDate: Date): void;

    getSkyObjectByName(objectName: string): SolarSystemObject | null;

    getEphemerisTypeByName(ephemerisTypeName: string): EphemerisType | null;

    setLocation(
      objectName: string,
      latitude: number,
      longitude: number,
      elevationFromObjectSurface: number
    ): void;

    getLatitudeLongitudeCoordinates(): { latitude: number; longitude: number };

    getRightAscensionDeclinationCoordinatesForObject(
      objectName: string,
      referenceDate?: Date
    ): TopocentricEquatorialSphericalCoordinates;

    getHourAngleDeclinationCoordinatesForObject(
      objectName: string,
      referenceDate?: Date
    ): TopocentricEquatorialHourAngleDeclinationCoordinates;

    getIlluminatedFraction(
      objectName: string,
      referenceDate?: Date
    ): number;

    getLocalMeanSiderealTime(): number;

    getAltitudeAzimuthCoordinatesForObject(
      objectName: string,
      referenceDate?: Date
    ): TopocentricHorizontalSphericalCoordinates;

    getEphemerisDateForObject(
      objectName: string,
      referenceDate: Date,
      ephemerisTypeName: string
    ): Date | null;

    getObserverLocation(): ObserverLocation | null;
  }

  export function initialize(latitude: number, longitude: number): AstronomyJS;
}
