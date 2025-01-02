import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    getDoc,
    query,
    where,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../firebase.config';
import Logger from '../utils/Logger';

class FirebaseService {
    // Generic method to add a document to a collection
    static async addDocument(collectionName, data) {
        try {
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            Logger.info(`Document added to ${collectionName}`, { 
                documentId: docRef.id 
            });

            return { id: docRef.id, ...data };
        } catch (error) {
            Logger.error(`Error adding document to ${collectionName}`, { 
                error: error.message 
            });
            throw error;
        }
    }

    // Generic method to update a document
    static async updateDocument(collectionName, documentId, updates) {
        try {
            const docRef = doc(db, collectionName, documentId);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date()
            });

            Logger.info(`Document updated in ${collectionName}`, { 
                documentId, 
                updates: Object.keys(updates) 
            });

            return true;
        } catch (error) {
            Logger.error(`Error updating document in ${collectionName}`, { 
                error: error.message, 
                documentId 
            });
            throw error;
        }
    }

    // Generic method to delete a document
    static async deleteDocument(collectionName, documentId) {
        try {
            const docRef = doc(db, collectionName, documentId);
            await deleteDoc(docRef);

            Logger.info(`Document deleted from ${collectionName}`, { 
                documentId 
            });

            return true;
        } catch (error) {
            Logger.error(`Error deleting document from ${collectionName}`, { 
                error: error.message, 
                documentId 
            });
            throw error;
        }
    }

    // Get a single document by ID
    static async getDocument(collectionName, documentId) {
        try {
            const docRef = doc(db, collectionName, documentId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Document not found');
            }

            return { id: docSnap.id, ...docSnap.data() };
        } catch (error) {
            Logger.error(`Error fetching document from ${collectionName}`, { 
                error: error.message, 
                documentId 
            });
            throw error;
        }
    }

    // Get all documents in a collection
    static async getAllDocuments(collectionName, orderByField = 'createdAt', limitCount = null) {
        try {
            let q = query(
                collection(db, collectionName), 
                orderBy(orderByField, 'desc')
            );

            if (limitCount) {
                q = query(q, limit(limitCount));
            }

            const querySnapshot = await getDocs(q);
            const documents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            Logger.info(`Fetched documents from ${collectionName}`, { 
                count: documents.length 
            });

            return documents;
        } catch (error) {
            Logger.error(`Error fetching documents from ${collectionName}`, { 
                error: error.message 
            });
            throw error;
        }
    }

    // Query documents with specific conditions
    static async queryDocuments(collectionName, conditions = [], orderByField = 'createdAt', limitCount = null) {
        try {
            let q = query(collection(db, collectionName));

            // Add where conditions
            conditions.forEach(condition => {
                q = query(q, where(condition.field, condition.operator, condition.value));
            });

            // Add ordering
            q = query(q, orderBy(orderByField, 'desc'));

            // Add limit if specified
            if (limitCount) {
                q = query(q, limit(limitCount));
            }

            const querySnapshot = await getDocs(q);
            const documents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            Logger.info(`Queried documents from ${collectionName}`, { 
                conditions, 
                count: documents.length 
            });

            return documents;
        } catch (error) {
            Logger.error(`Error querying documents from ${collectionName}`, { 
                error: error.message, 
                conditions 
            });
            throw error;
        }
    }

    // Specific service methods
    static async createBooking(bookingData) {
        return this.addDocument('bookings', bookingData);
    }

    static async getServiceHistory(userId) {
        return this.queryDocuments('bookings', [
            { field: 'userId', operator: '==', value: userId }
        ], 'createdAt');
    }

    static async getReferralInfo(userId) {
        return this.getDocument('referrals', userId);
    }

    static async updateUserProfile(userId, profileData) {
        return this.updateDocument('users', userId, profileData);
    }
}

export default FirebaseService;
