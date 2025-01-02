const express = require('express');
const multer = require('multer');
const s3Service = require('../services/s3Service');
const authController = require('../controllers/authController');

const router = express.Router();

// Multer for handling file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
        // Allow only specific file types
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
        }
    }
});

// Generate Presigned URL for direct upload
router.get('/presigned-url', authController.protect, async (req, res) => {
    try {
        const { fileName } = req.query;
        
        if (!fileName) {
            return res.status(400).json({ message: 'Filename is required' });
        }

        const result = await s3Service.generatePresignedUrl(fileName);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to generate presigned URL', 
            error: error.message 
        });
    }
});

// Direct file upload endpoint
router.post('/upload', 
    authController.protect, 
    upload.single('file'), 
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const uploadResult = await s3Service.uploadFile(req.file);
            
            res.status(201).json({
                message: 'File uploaded successfully',
                file: uploadResult
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'File upload failed', 
                error: error.message 
            });
        }
    }
);

// Delete file endpoint
router.delete('/delete/:fileKey', 
    authController.protect, 
    async (req, res) => {
        try {
            const { fileKey } = req.params;
            
            if (!fileKey) {
                return res.status(400).json({ message: 'File key is required' });
            }

            await s3Service.deleteFile(fileKey);
            
            res.json({ 
                message: 'File deleted successfully' 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'File deletion failed', 
                error: error.message 
            });
        }
    }
);

module.exports = router;
