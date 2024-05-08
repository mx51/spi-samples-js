# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.7] - 2024-05-08

### Changed

- [INTG-880](https://mx51.atlassian.net/browse/INTG-880) Bump SPI version to 2.9.12

## [1.7.6] - 2024-04-09 

### Added

- [INTG-702](https://mx51.atlassian.net/browse/INTG-702) Terminals list actions
- [INTG-651](https://mx51.atlassian.net/browse/INTG-651) Store terminal profiles to allow for faster pairing
- [INTG-793](https://mx51.atlassian.net/browse/INTG-793) Notification when no terminals are available to transact
- [INTG-729](https://mx51.atlassian.net/browse/INTG-729) Get transaction functionality
- [INTG-794](https://mx51.atlassian.net/browse/INTG-794) About page available for terminals in all pairing states
- [INTG-784](https://mx51.atlassian.net/browse/INTG-784) Split by amount feature
- [INTG-803](https://mx51.atlassian.net/browse/INTG-803) Split evenly feature

### Fixed

- [INTG-812](https://mx51.atlassian.net/browse/INTG-812) POS does not display any error when the user attempts to cancel the flow outside the MXA
- [INTG-666](https://mx51.atlassian.net/browse/INTG-666) Pre Auth Complete final screen does not include the surcharge amount
- [INTG-843](https://mx51.atlassian.net/browse/INTG-843) Pairing status discrepancy between "pairing screen" and "About this terminal" page

### Changed

[INTG-706](https://mx51.atlassian.net/browse/INTG-706) Merged long running feature branch into main branch
[INTG-845](https://mx51.atlassian.net/browse/INTG-845) Refactored PaymentSummary page into reusable component for consistency across transaction types

## [1.6.0] - 2024-02-28

### Added

- [INTG-711](https://mx51.atlassian.net/browse/INTG-711) Migrate Table POS into Espresso POS

## [1.5.0] - 2024-02-20

### Added

- [INTG-754](https://mx51.atlassian.net/browse/INTG-754) Recover overridden transactions
- [INTG-753](https://mx51.atlassian.net/browse/INTG-753) Recover transaction outcome after network outage

### Fixed

- [INTG-505](https://mx51.atlassian.net/browse/INTG-505) Blank screen after unknown transaction is overridden

## [1.4.0] - 2023-12-14

### Added

- [INTG-701] (https://mx51.atlassian.net/browse/INTG-701) Transaction listing page.
- [INTG-737] (https://mx51.atlassian.net/browse/INTG-737) Transaction detail page.

## [1.3.1] - 2023-11-20

### Added

- [INTG-656] (https://mx51.atlassian.net/browse/INTG-656) Auto address check to support other environments field

## [1.3.0] - 2023-9-26

### Added

- [INTG-573](https://mx51.atlassian.net/browse/INTG-573) Migrate MotelPOS pre-auth transaction flows to EspressoPOS
- [INTG-626](https://mx51.atlassian.net/browse/INTG-573) Mx51 logo update
- [INTG-613](https://mx51.atlassian.net/browse/INTG-613) Removed serial number field validation

## [1.2.9] - 2023-9-14

### Added

- [INTG-628](https://mx51.atlassian.net/browse/INTG-628) Allow Espresso POS to select the environment used for pairing
- [INTG-266](https://mx51.atlassian.net/browse/INTG-266) Terminal settings tab

## [1.2.8] - 2023-8-23

### Fixed

- [INTG-617](https://mx51.atlassian.net/browse/INTG-617) POS does not display the refund amount entered

## [1.2.7] - 2023-8-17

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
