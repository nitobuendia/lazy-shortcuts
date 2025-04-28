/** @file Creates a zip file from dist to use as a Chrome Extension. */

const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const distPath = path.resolve(__dirname, '../dist');
const buildZipPath = path.resolve(__dirname, '../lazy-shortcuts-extension.zip');

/**
 * Creates a Zip file from the /dist/ folder.
 * Must run `npm run build` first to create the dist folder.
 */
const createZipExtension = () => {
  if (!fs.existsSync(distPath)) {
    console.error(
      'Error: The "dist" folder does not exist. Run "npm run build" first.'
    );
    process.exit(1);
  }

  try {
    const zip = new AdmZip();
    zip.addLocalFolder(distPath);
    zip.writeZip(buildZipPath);
    console.log(`Successfully created ${buildZipPath}`);
  } catch (e) {
    console.error('Error creating zip file:', e);
    process.exit(1);
  }
};

createZipExtension();
