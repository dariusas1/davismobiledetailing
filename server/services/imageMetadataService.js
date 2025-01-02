const sharp = require('sharp');
const ExifReader = require('exifreader');
const { logger } = require('../utils/logger');

class ImageMetadataService {
    // Extract technical metadata
    async extractTechnicalMetadata(file) {
        try {
            // Use Sharp for image processing
            const metadata = await sharp(file.buffer).metadata();

            return {
                format: metadata.format,
                width: metadata.width,
                height: metadata.height,
                colorSpace: metadata.space,
                channels: metadata.channels,
                fileSize: file.size,
                mimeType: file.mimetype
            };
        } catch (error) {
            logger.error('Technical metadata extraction failed', {
                filename: file.originalname,
                error: error.message
            });
            return null;
        }
    }

    // Extract EXIF metadata
    async extractExifMetadata(file) {
        try {
            const tags = await ExifReader.load(file.buffer);
            
            // Clean and transform EXIF data
            const cleanedTags = {};
            Object.keys(tags).forEach(key => {
                if (tags[key] && tags[key].value) {
                    cleanedTags[key] = tags[key].value;
                }
            });

            return {
                camera: {
                    make: cleanedTags['Make'],
                    model: cleanedTags['Model']
                },
                dateTime: cleanedTags['DateTimeOriginal'],
                gps: {
                    latitude: cleanedTags['GPSLatitude'],
                    longitude: cleanedTags['GPSLongitude']
                },
                settings: {
                    aperture: cleanedTags['FNumber'],
                    exposureTime: cleanedTags['ExposureTime'],
                    iso: cleanedTags['ISOSpeedRatings']
                }
            };
        } catch (error) {
            logger.warn('EXIF metadata extraction failed', {
                filename: file.originalname,
                error: error.message
            });
            return null;
        }
    }

    // Comprehensive image analysis
    async analyzeImage(file) {
        try {
            const [technical, exif] = await Promise.all([
                this.extractTechnicalMetadata(file),
                this.extractExifMetadata(file)
            ]);

            return {
                technical,
                exif,
                processedAt: new Date().toISOString()
            };
        } catch (error) {
            logger.error('Comprehensive image analysis failed', {
                filename: file.originalname,
                error: error.message
            });
            return null;
        }
    }
}

module.exports = new ImageMetadataService();
