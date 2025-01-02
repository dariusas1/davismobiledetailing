import axios from 'axios';
import AuthService from './authService';

class UploadService {
    // Get presigned URL for upload
    async getPresignedUrl(fileName) {
        try {
            const response = await axios.get('/api/upload/presigned-url', {
                params: { fileName },
                headers: { 
                    Authorization: `Bearer ${AuthService.getToken()}` 
                }
            });
            return response.data;
        } catch (error) {
            this.handleError(error, 'Failed to get presigned URL');
        }
    }

    // Direct file upload to our backend
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/upload/upload', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${AuthService.getToken()}` 
                }
            });
            return response.data.file;
        } catch (error) {
            this.handleError(error, 'File upload failed');
        }
    }

    // Direct upload to S3 using presigned URL
    async uploadToS3(presignedUrl, file) {
        try {
            const response = await axios.put(presignedUrl, file, {
                headers: { 'Content-Type': file.type }
            });
            return response;
        } catch (error) {
            this.handleError(error, 'S3 upload failed');
        }
    }

    // Delete uploaded file
    async deleteFile(fileKey) {
        try {
            const response = await axios.delete(`/api/upload/delete/${fileKey}`, {
                headers: { 
                    Authorization: `Bearer ${AuthService.getToken()}` 
                }
            });
            return response.data;
        } catch (error) {
            this.handleError(error, 'File deletion failed');
        }
    }

    // Centralized error handling
    handleError(error, defaultMessage) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Upload Error Response:', error.response.data);
            throw new Error(error.response.data.message || defaultMessage);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Upload Error Request:', error.request);
            throw new Error('No response received from server');
        } else {
            // Something happened in setting up the request
            console.error('Upload Error Message:', error.message);
            throw new Error(defaultMessage);
        }
    }

    // Image compression before upload
    async compressImage(file, maxSizeMB = 1) {
        const options = {
            maxSizeMB,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };

        try {
            const compressedFile = await window.imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error('Image compression failed:', error);
            return file; // Return original file if compression fails
        }
    }
}

export default new UploadService();
