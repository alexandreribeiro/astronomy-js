import { PLANETS_LIST } from "./planets/planets-list.js";
import { DWARF_PLANETS_LIST } from "./dwarf-planets/dwarf-planets-list.js";
import { SATELLITES_LIST } from "./satellites/satellites-list.js";
import { Sun } from "./sun.js";

export const SOLAR_SYSTEM_OBJECTS_LIST = [new Sun()]
  .concat(PLANETS_LIST)
  .concat(SATELLITES_LIST)
  .concat(DWARF_PLANETS_LIST);
