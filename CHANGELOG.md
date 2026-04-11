# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added the Moon as a supported solar system object.
- Added the `getIlluminatedFractionForObject` method to `AstronomyJS`.
- Added the `getLocalMeanSiderealTime` method to `AstronomyJS`.
- Expanded JSDoc coverage across the library.
- Exposed new types in `index.d.ts`:
    - `EphemerisType`
    - `SolarSystemObject`
    - `ObserverLocation`
    - `TopocentricEquatorialSphericalCoordinates`
    - `TopocentricEquatorialHourAngleDeclinationCoordinates`
    - `TopocentricHorizontalSphericalCoordinates`

### Changed

- **Breaking:** `getLatitudeLongitudeCoordinates` was renamed to `getObserverLocation` and now returns
  `ObserverLocation`.
- **Breaking:** `getAltAzCoordinatesForObject` was renamed to `getAltitudeAzimuthCoordinatesForObject` and now returns
  `TopocentricHorizontalSphericalCoordinates`.
- **Breaking:** `getRADecCoordinatesForObject` was renamed to `getRightAscensionDeclinationCoordinatesForObject` and now
  returns `TopocentricEquatorialSphericalCoordinates`.
- **Breaking:** `getHADecCoordinatesForObject` was renamed to `getHourAngleDeclinationCoordinatesForObject` and now
  returns `TopocentricEquatorialHourAngleDeclinationCoordinates`.
- The `AstronomicalCalculator` class now only exposes static methods.
- Observer location state was moved to the `AstronomyJS` class.
- `AstronomyJS` is now the only stateful class.

## [0.1.8] - 2025-10-24

### Changed

- Refactored the internal coordinate system used by astronomical calculations. No methods on `AstronomyJS` were changed.

## [0.1.7] - 2025-10-07

### Fixed

- Fixed the calculation for the ephemeris `GOLDEN_HOUR_END` in `getEphemerisDateForObject`.

## [0.1.6] - 2025-10-05

### Added

- Added `LOWER_TRANSIT` to `EPHEMERIS_TYPE`.

## [0.1.5] - 2025-10-05

### Added

- Added `SUNRISE`, `SUNSET`, `GOLDEN_HOUR_START`, and `GOLDEN_HOUR_END` to `EPHEMERIS_TYPE`.

## [0.1.4] - 2025-06-16

### Changed

- **Breaking:** Renamed `getLatitudeLongitudeLocation` to `getLatitudeLongitudeCoordinates` on `AstronomyJS`.

## [0.1.3] - 2025-06-16

### Added

- Added the `getLatitudeLongitudeLocation` method to `AstronomyJS`.

## [0.1.2] - 2025-06-06

### Added

- Added the README to the published documentation.

## [0.1.1] - 2025-06-04

### Changed

- Changed the package name from `astronomyjs` to `astronomy-js`.

## [0.1.0] - 2025-06-04

### Added

- Initial release of the library.
- Added documentation and demo.
- Added the initial set of methods on `AstronomyJS` for:
    - Julian date and date management
    - observer location
    - sky object and ephemeris type lookup
    - equatorial, hour angle, and horizontal coordinate calculations
    - ephemeris date calculations

[0.1.8]: https://www.npmjs.com/package/astronomy-js/v/0.1.8

[0.1.7]: https://www.npmjs.com/package/astronomy-js/v/0.1.7

[0.1.6]: https://www.npmjs.com/package/astronomy-js/v/0.1.6

[0.1.5]: https://www.npmjs.com/package/astronomy-js/v/0.1.5

[0.1.4]: https://www.npmjs.com/package/astronomy-js/v/0.1.4

[0.1.3]: https://www.npmjs.com/package/astronomy-js/v/0.1.3

[0.1.2]: https://www.npmjs.com/package/astronomy-js/v/0.1.2

[0.1.1]: https://www.npmjs.com/package/astronomy-js/v/0.1.1

[0.1.0]: https://www.npmjs.com/package/astronomy-js/v/0.1.0
