/** @file Creates a zip file from dist to use as a Chrome Extension. */

const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');
const extensionConfig = require('../extension.config');

/** Input files for the Chrome Extension. */
const DIST_PATH = path.resolve(
  __dirname, `../${extensionConfig.OUTPUT_BUILD_DIR}`);

/** Output zip file for the Chrome Extension. */
const PACKAGE_PATH = path.resolve(
  __dirname,
  `../${extensionConfig.OUTPUT_PACKAGE_DIR}/` +
    `${extensionConfig.CHROME_EXTENSION_NAME}.zip`
);

/**
 * Creates a Zip file from the /dist/ folder.
 * Must run `npm run build` first to create the dist folder.
 */
const createZipExtension = () => {
  if (!fs.existsSync(DIST_PATH)) {
    console.error(
      'Error: The "dist" folder does not exist. Run "npm run build" first.'
    );
    process.exit(1);
  }

  try {
    const zip = new AdmZip();
    zip.addLocalFolder(DIST_PATH);
    zip.writeZip(PACKAGE_PATH);
    console.log(`Successfully created ${PACKAGE_PATH}`);
  } catch (e) {
    console.error('Error creating zip file:', e);
    process.exit(1);
  }
};

createZipExtension();
