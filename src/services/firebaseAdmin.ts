import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

// Ensure environment variables are loaded (use dotenv or similar if needed)
// require('dotenv').config(); // Uncomment this line if you are using dotenv

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  // Replace new line characters in private key (common issue when using environment variables)
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') ?? '',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
