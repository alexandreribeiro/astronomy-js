import { PLANETS_LIST } from "./planets/planets-list";
import { Sun } from "./sun";

export const SOLAR_SYSTEM_OBJECTS_LIST = [new Sun()].concat(PLANETS_LIST);
