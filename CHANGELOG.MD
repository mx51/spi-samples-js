# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- [INTG-506](https://mx51.atlassian.net/browse/INTG-506) Changelog file
- [INTG-522](https://mx51.atlassian.net/browse/INTG-522) Pairing record is missing when terminal is disconnected
- [INTG-544](https://mx51.atlassian.net/browse/INTG-544) View the version of EspressoPOS
### Fixed

- [INTG-549](https://mx51.atlassian.net/browse/INTG-549) Incorrect version of POS shown in various places
- [INTG-528](https://mx51.atlassian.net/browse/INTG-528) EspressoPOS payment override UX improvement
- [INTG-532](https://mx51.atlassian.net/browse/INTG-532) Amounts are not reset after completing transaction
- [INTG-578](https://mx51.atlassian.net/browse/INTG-578) Order summary does not show tip, surcharge or cashout after transaction is cancelled
- [INTG-530](https://mx51.atlassian.net/browse/INTG-530) Additional amounts such as surcharge is reset to 0 when transaction is cancelled
- [INTG-518](https://mx51.atlassian.net/browse/INTG-518) Select Card button without selecting a terminal
## [1.2.6] - 2023-6-6

### Changed

- [INTG-526](https://mx51.atlassian.net/browse/INTG-526) (UI) Placement of prompt for cashout checkbox on Espresso POS
- [INTG-503](https://mx51.atlassian.net/browse/INTG-503) Override the subtotal of an order on EspressoPOS

## [1.2.5] - 2023-5-29

### Added

- [INTG-504](https://mx51.atlassian.net/browse/INTG-504) Cashout prompt (terminal based) in EspressoPOS

### Changed

- [INTG-490](https://mx51.atlassian.net/browse/INTG-490) hide p@t on espresso pos
- [INTG-504](https://mx51.atlassian.net/browse/INTG-504) Update prompt for checkout to hide instead of disable
- [INTG-512](https://mx51.atlassian.net/browse/INTG-512) Bump SPI version to 2.9.8

### Fixed

- [INTG-504](https://mx51.atlassian.net/browse/INTG-504) Security and stabilty enhancements

## [1.2.4] - 2023-5-10

### Changed

- [INTG-491](https://mx51.atlassian.net/browse/INTG-491) Bump SPI version to 2.9.7

## [1.2.3] - 2023-5-3

### Changed

- [INTG-488](https://mx51.atlassian.net/browse/INTG-488) Bump SPI version to 2.9.6

## [1.2.2] - 2022-12-6

### Changed

- Bump EspressoPOS version to 1.2.2

## [1.2.1] - 2022-9-12

### Fixed

- Chatty messages

## [1.2.0] - 2022-8-23

### Changed

- [INTG-248](https://mx51.atlassian.net/browse/INTG-248) Make the transaction result modal dynamic for unsuccessful transactions
- [INTG-248](https://mx51.atlassian.net/browse/INTG-248) style cleanup
- [INTG-248](https://mx51.atlassian.net/browse/INTG-248) Updated tests

## [1.1.0] - 2022-8-16

### Added

- [INTG-265](https://mx51.atlassian.net/browse/INTG-265) Engine version
- [INTG-265](https://mx51.atlassian.net/browse/INTG-265) Snapshot test

### Changed

- [INTG-265](https://mx51.atlassian.net/browse/INTG-265) Updated readme requirements/script
- [INTG-265](https://mx51.atlassian.net/browse/INTG-265) Migrated the support tool from burgerPOS to espressoPOS
- [INTG-265](https://mx51.atlassian.net/browse/INTG-265) Updated the code to support better types for espressoPOS eslint config
- [INTG-265](https://mx51.atlassian.net/browse/INTG-265) Updated the style according to material UI and Jess's figma designs
- [INTG-265](https://mx51.atlassian.net/browse/INTG-265) Refactor the result tables into another file
- [INTG-265](https://mx51.atlassian.net/browse/INTG-265) Refactor to use shared types

## [1.0.4] - 2022-7-12

### Fixed

- Unable to pair EspressoPOS with Gecko Bank

## [1.0.3] - 2022-7-1

### Changed

- Hidden developer mode toggle when terminal is unpaired
- Display developer mode button on related screens
- Updated unit tests (ensure test coverage is 80% above)
- Ensure order finished page also show developer mode toggle button

## [1.0.2] - 2022-6-21

### Fixed

- Duplicate surcharge for moto purchase

## [1.0.1] - 2022-5-25

### Changed

- Disable test mode checkbox during pairing for Gecko Bank
- [INTG-226](https://mx51.atlassian.net/browse/INTG-226) Updated project page title
- Updated version value to 1.0.0
- Update payment providers automatically

### Fixed

- When selected other and entered gko

## [1.0.0] - 2022-5-17

### Changed

- Removed character v from deployment condition in azure yaml file

## [0.0.2] - 2022-5-16

### Added

- Production Pipeline

### Changed

- Production pipeline yaml configs
