import {SolarSystemObject} from "../solar-system-object";
import {OrbitalParameters} from "../orbital-parameters";

export class Jupiter extends SolarSystemObject {
    constructor() {
        const orbitalParameters = new OrbitalParameters(
            5.20336301, 0.04839266, 1.30530, 100.55615, 14.75385, 34.40438,
            0.00060737, -0.00012880, -4.15, 1217.17, 839.93, 10925078.35
        );
        super('Jupiter', orbitalParameters, 69911000, 3.13);
    }
}