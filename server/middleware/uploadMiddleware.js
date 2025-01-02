const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

// Ensure upload directories exist
const ensureDirectoryExists = (directory) => {
    console.log(`Ensuring directory exists: ${directory}`);
    if (!fs.existsSync(directory)) {
        console.log(`Creating directory: ${directory}`);
        fs.mkdirSync(directory, { recursive: true });
    }
    console.log(`Directory status: ${fs.existsSync(directory) ? 'exists' : 'does not exist'}`);
};

// Storage configuration for different upload types
const createStorage = (uploadPath) => {
    console.log(`Creating storage for path: ${uploadPath}`);
    ensureDirectoryExists(uploadPath);
    return multer.diskStorage({
        destination: (req, file, cb) => {
            console.log(`Setting destination for file: ${file.originalname}`);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            console.log(`Generating filename for: ${file.originalname}`);
            const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
            console.log(`Generated filename: ${uniqueFilename}`);
            cb(null, uniqueFilename);
        }
    });
};

// File filter to validate image uploads
const imageFileFilter = (req, file, cb) => {
    console.log(`Validating file: ${file.originalname}`);
    console.log(`File mimetype: ${file.mimetype}`);
    
    const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    console.log(`File validation results:
        Extension valid: ${extname}
        Mimetype valid: ${mimetype}
    `);

    if (extname && mimetype) {
        console.log('File validation passed');
        return cb(null, true);
    } else {
        console.log('File validation failed');
        cb(new Error('Invalid file type. Only image files are allowed.'), false);
    }
};

// Image size limits
const imageSizeLimits = {
    fileSize: 5 * 1024 * 1024 // 5MB
};

// Create upload directories
const projectsPath = path.join(__dirname, '..', 'uploads', 'projects');
const reviewsPath = path.join(__dirname, '..', 'uploads', 'reviews');
const packagesPath = path.join(__dirname, '..', 'uploads', 'packages');

ensureDirectoryExists(projectsPath);
ensureDirectoryExists(reviewsPath);
ensureDirectoryExists(packagesPath);

// Create multer instances for different upload types
console.log('Initializing multer instances...');

const projectUpload = multer({
    storage: createStorage(projectsPath),
    fileFilter: imageFileFilter,
    limits: imageSizeLimits
});
console.log('Project upload middleware initialized');

const reviewUpload = multer({
    storage: createStorage(reviewsPath),
    fileFilter: imageFileFilter,
    limits: imageSizeLimits
});
console.log('Review upload middleware initialized');

const packageUpload = multer({
    storage: createStorage(packagesPath),
    fileFilter: imageFileFilter,
    limits: imageSizeLimits
});
console.log('Package upload middleware initialized');

// Log upload attempts
const logUploadAttempt = (req, res, next) => {
    console.log('Processing upload attempt...');
    console.log('Request details:', {
        method: req.method,
        path: req.path,
        userId: req.user?.id,
        fileInfo: req.file || req.files
    });
    
    logger.info('Upload attempt', {
        userId: req.user?.id,
        fileType: req.file?.mimetype,
        fileSize: req.file?.size,
        originalName: req.file?.originalname,
        path: req.path,
        timestamp: new Date().toISOString()
    });
    next();
};

// Error handling middleware for uploads
const handleUploadErrors = (err, req, res, next) => {
    console.log('Handling upload error:', err);
    
    if (err instanceof multer.MulterError) {
        console.log('Multer error details:', {
            code: err.code,
            field: err.field,
            message: err.message
        });
        
        logger.error('Multer upload error', {
            code: err.code,
            field: err.field,
            message: err.message,
            userId: req.user?.id,
            path: req.path
        });
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
            error: err.code
        });
    }
    
    if (err.message === 'Invalid file type. Only image files are allowed.') {
        console.log('File type validation error');
        logger.error('Invalid file type error', {
            userId: req.user?.id,
            originalName: req.file?.originalname,
            mimetype: req.file?.mimetype,
            path: req.path
        });
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    console.log('Unhandled upload error:', err);
    next(err);
};

// Export middleware functions
console.log('Exporting upload middleware functions...');
module.exports = {
    uploadProjectImage: projectUpload,
    uploadReviewImage: reviewUpload,
    uploadPackageImage: packageUpload,
    logUploadAttempt,
    handleUploadErrors
};
console.log('Upload middleware setup complete');
