/** @file Provides common constants to use in the Chrome Extension config. */

/** Name of the zip file for the Chrome Extension. */
const CHROME_EXTENSION_NAME = 'lazy-shortcuts-extension';

/** Directory where the extension files are built. */
const OUTPUT_BUILD_DIR = 'build';

/** Directory where the extension zip file is created. */
const OUTPUT_PACKAGE_DIR = 'dist'

module.exports = {
  OUTPUT_BUILD_DIR,
  OUTPUT_PACKAGE_DIR,
  CHROME_EXTENSION_NAME,
};
