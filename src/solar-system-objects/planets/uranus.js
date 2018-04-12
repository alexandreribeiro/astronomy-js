import {SolarSystemObject} from "../solar-system-object";
import {OrbitalParameters} from "../orbital-parameters";

export class Uranus extends SolarSystemObject {
    constructor() {
        const orbitalParameters = new OrbitalParameters(
            19.19126393, 0.04716771, 0.76986, 74.22988, 170.96424, 313.23218,
            0.00152025, -0.00019150, -2.09, -1681.40, 1312.56, 1542547.79
        );
        super('Uranus', orbitalParameters, 25362000, 97.77);
    }
}