# Puppeteer BotBase

## 9.0.0 - Typescript build

### Changed

- Codebase moved to typescript
- BotBase constructor params
- By default, config is expected at `./config/config.json`

### Removed

- `LocalFsCookieSaver` and `LocalFsScreenshotSaver` in favour of `CookieSaver` and `ScreenshotSaver`

## 8.0.0

### Changed

- `helper.writeIPToFile` is expecting the output full file path, instead
- By default, config is expected at `./config/config.ts` instead of `./config/config.json`

### Removed

- `helper.readJsonFile`

### Added

- `helper.loadJson`: function to load a json

## 7.0.0

### Changed

- Improved imports: all of them can be imported from the index file.

## 6.0.0

### Removed

- `HelperPuppeteer.getLocalPuppeteerInstallation` is removed. We should use `executablePath` from puppeteer instead.
- `helper.textExistsInPage` is removed. We should use `HelperPuppeteer.isTextPresentOnWebpage`.

### Changed

- `helper.readJsonFile` is not async anymore.

## 3.0.7

- deprecated page.waitfortimeout replaced

## 3.0.6

- Updated Dependencies

## 3.0.0

- Updated to puppeteer 19+

## 2.1.0

- Updated deps

## 2.0.0

- Changed BotBase constructor parameters

## 1.0.18

- Updated deps and puppeteer version with vulnerability

## 1.0.16

- Fixed bug on shutDown method (no await)

## 1.0.15

- Added filterAsync function

## 1.0.0

==================

- Breaking changes:
  - constructor BotBase param order change: (mainUrl, basePath)

## 0.2.3

==================
