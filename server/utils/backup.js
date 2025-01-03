import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import AWS from 'aws-sdk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION
});

const backupDir = path.join(__dirname, '../backups');

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

export const createBackup = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `backup-${timestamp}`);
  const databaseUrl = process.env.MONGODB_URI;

  try {
    // Create backup using mongodump
    await new Promise((resolve, reject) => {
      const mongodump = spawn('mongodump', [
        `--uri="${databaseUrl}"`,
        `--out=${backupPath}`
      ]);

      mongodump.stdout.on('data', (data) => {
        console.log(`mongodump: ${data}`);
      });

      mongodump.stderr.on('data', (data) => {
        console.error(`mongodump error: ${data}`);
      });

      mongodump.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`mongodump exited with code ${code}`));
        }
      });
    });

    // Create zip file
    const zipPath = `${backupPath}.zip`;
    await new Promise((resolve, reject) => {
      const zip = spawn('zip', ['-r', zipPath, backupPath]);

      zip.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`zip exited with code ${code}`));
        }
      });
    });

    // Upload to S3
    const fileContent = fs.readFileSync(zipPath);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `backups/mongodb-${timestamp}.zip`,
      Body: fileContent
    };

    await s3.upload(params).promise();

    // Clean up local files
    fs.rmSync(backupPath, { recursive: true, force: true });
    fs.unlinkSync(zipPath);

    console.log(`Backup completed successfully: mongodb-${timestamp}.zip`);
    return `mongodb-${timestamp}.zip`;
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
};

export const scheduleBackups = () => {
  // Schedule daily backups at 2 AM
  const backupTime = new Date();
  backupTime.setHours(2, 0, 0, 0);

  let timeUntilBackup = backupTime.getTime() - Date.now();
  if (timeUntilBackup < 0) {
    timeUntilBackup += 24 * 60 * 60 * 1000; // Add 24 hours
  }

  setTimeout(() => {
    createBackup();
    // Schedule next backup
    setInterval(createBackup, 24 * 60 * 60 * 1000);
  }, timeUntilBackup);
};

export const restoreBackup = async (backupFileName) => {
  try {
    // Download from S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `backups/${backupFileName}`
    };

    const data = await s3.getObject(params).promise();
    const localZipPath = path.join(backupDir, backupFileName);
    fs.writeFileSync(localZipPath, data.Body);

    // Extract zip
    const extractPath = path.join(backupDir, backupFileName.replace('.zip', ''));
    await new Promise((resolve, reject) => {
      const unzip = spawn('unzip', [localZipPath, '-d', extractPath]);

      unzip.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`unzip exited with code ${code}`));
        }
      });
    });

    // Restore using mongorestore
    await new Promise((resolve, reject) => {
      const mongorestore = spawn('mongorestore', [
        `--uri="${process.env.MONGODB_URI}"`,
        '--drop',
        extractPath
      ]);

      mongorestore.stdout.on('data', (data) => {
        console.log(`mongorestore: ${data}`);
      });

      mongorestore.stderr.on('data', (data) => {
        console.error(`mongorestore error: ${data}`);
      });

      mongorestore.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`mongorestore exited with code ${code}`));
        }
      });
    });

    // Clean up
    fs.rmSync(extractPath, { recursive: true, force: true });
    fs.unlinkSync(localZipPath);

    console.log('Restore completed successfully');
    return true;
  } catch (error) {
    console.error('Restore failed:', error);
    throw error;
  }
}; 