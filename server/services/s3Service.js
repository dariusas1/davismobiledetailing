const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION
});

const s3 = new AWS.S3();

class S3Service {
    // Upload file to S3
    async uploadFile(file, folder = 'uploads') {
        // Generate unique filename
        const fileName = `${folder}/${uuidv4()}${path.extname(file.originalname)}`;

        // S3 upload parameters
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        try {
            // Upload to S3
            const uploadResult = await s3.upload(params).promise();

            return {
                url: uploadResult.Location,
                key: uploadResult.Key,
                originalName: file.originalname
            };
        } catch (error) {
            console.error('S3 Upload Error:', error);
            throw new Error('File upload failed');
        }
    }

    // Delete file from S3
    async deleteFile(fileKey) {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey
        };

        try {
            await s3.deleteObject(params).promise();
            return true;
        } catch (error) {
            console.error('S3 Delete Error:', error);
            throw new Error('File deletion failed');
        }
    }

    // Generate presigned URL for direct upload
    async generatePresignedUrl(fileName, folder = 'uploads') {
        const uniqueFileName = `${folder}/${uuidv4()}${path.extname(fileName)}`;

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: uniqueFileName,
            Expires: 300 // URL expires in 5 minutes
        };

        try {
            const presignedUrl = await s3.getSignedUrl('putObject', params);
            return {
                presignedUrl,
                fileKey: uniqueFileName
            };
        } catch (error) {
            console.error('Presigned URL Error:', error);
            throw new Error('Failed to generate presigned URL');
        }
    }
}

module.exports = new S3Service();
