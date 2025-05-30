import { PLANETS_LIST } from "./planets/planets-list";
import { DWARF_PLANETS_LIST } from "./dwarf-planets/dwarf-planets-list.js";
import { Sun } from "./sun";

export const SOLAR_SYSTEM_OBJECTS_LIST = [new Sun()]
  .concat(PLANETS_LIST)
  .concat(DWARF_PLANETS_LIST);
