import imageCompression from 'browser-image-compression';
import { v4 as uuidv4 } from 'uuid';

export const compressImage = async (file, options = {}) => {
    const defaultOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    };
    const mergedOptions = { ...defaultOptions, ...options };

    try {
        return await imageCompression(file, mergedOptions);
    } catch (error) {
        console.warn('Image compression failed, using original file', error);
        return file;
    }
};

export const generateUniqueId = () => uuidv4();

export const createImagePreview = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};
