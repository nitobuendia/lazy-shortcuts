const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const distPath = path.resolve(__dirname, '../dist');
const buildZipPath = path.resolve(__dirname, '../build.zip');

// Ensure the dist folder exists
if (!fs.existsSync(distPath)) {
  console.error('Error: The "dist" folder does not exist. Run "npm run build" first.');
  process.exit(1);
}

const zip = new AdmZip();
zip.addLocalFolder(distPath);

try {
  zip.writeZip(buildZipPath);
  console.log(`Successfully created ${buildZipPath}`);
} catch (e) {
  console.error('Error creating zip file:', e);
  process.exit(1);
}
