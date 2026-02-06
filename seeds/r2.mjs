import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const bucket = 'honox-blog-bucket'; // Change this to your R2 bucket name
const sourceDir = path.resolve('./seeds/r2'); // Change this to your local seeds directory

function uploadDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      uploadDir(fullPath);
    } else {
      const key = path.relative(sourceDir, fullPath);
      const cmd = `npx wrangler r2 object put "${bucket}/${key}" --file="${fullPath}" --local`;
      console.log(`Uploading: ${key}`);
      execSync(cmd, { stdio: 'inherit' });
    }
  }
}

uploadDir(sourceDir);
console.log('Seeding done!');
