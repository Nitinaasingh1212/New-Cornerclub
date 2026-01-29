import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

        if (serviceAccount.project_id) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log('✅ Firebase Admin SDK initialized successfully');
        } else {
            console.log('⚠️ FIREBASE_SERVICE_ACCOUNT is missing or invalid. Falling back to default initialization.');
            admin.initializeApp();
        }
    } catch (error) {
        console.error('❌ Firebase Admin SDK initialization error:', error);
        // During local dev, if env var isn't set, we might hit here.
        // In production, this must be set.
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
