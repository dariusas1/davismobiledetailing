import axios from 'axios';
import Logger from '../utils/Logger';

const API_URL = '/api/packages';

class PackageService {
    static async fetchAllPackages() {
        try {
            const response = await axios.get(API_URL, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            
            Logger.log('Packages fetched successfully');
            return response.data;
        } catch (error) {
            Logger.error('Failed to fetch packages', error);
            throw error;
        }
    }

    static async createPackage(packageData) {
        try {
            const response = await axios.post(API_URL, packageData, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            
            Logger.log('Package created successfully', { packageName: packageData.name });
            return response.data;
        } catch (error) {
            Logger.error('Failed to create package', error);
            throw error;
        }
    }

    static async updatePackage(packageId, packageData) {
        try {
            const response = await axios.put(`${API_URL}/${packageId}`, packageData, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            
            Logger.log('Package updated successfully', { packageId, packageName: packageData.name });
            return response.data;
        } catch (error) {
            Logger.error('Failed to update package', error);
            throw error;
        }
    }

    static async deletePackage(packageId) {
        try {
            const response = await axios.delete(`${API_URL}/${packageId}`, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('userToken')}` 
                }
            });
            
            Logger.log('Package deleted successfully', { packageId });
            return response.data;
        } catch (error) {
            Logger.error('Failed to delete package', error);
            throw error;
        }
    }
}

export default PackageService;
