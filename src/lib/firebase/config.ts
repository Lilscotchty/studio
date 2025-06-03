
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

// Directly use the user-provided configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLfpHD6tKlxekkYLH6IFRkZxmp2pwhmyM",
  authDomain: "marketvision-ai-26nvv.firebaseapp.com",
  projectId: "marketvision-ai-26nvv",
  storageBucket: "marketvision-ai-26nvv.firebasestorage.app", // User-provided value
  messagingSenderId: "988146260477",
  appId: "1:988146260477:web:df3078ad6c25421825e194"
};

// Log the configuration being used
// Redact most of the API key for safety in logs if it's being displayed publicly
let apiKeyDisplay = firebaseConfig.apiKey;
if (apiKeyDisplay && apiKeyDisplay.length > 10) {
    apiKeyDisplay = `${apiKeyDisplay.substring(0, 5)}...${apiKeyDisplay.slice(-4)}`;
}

console.log("--- Firebase Configuration (Hardcoded in src/lib/firebase/config.ts) ---");
console.log(`apiKey: ${apiKeyDisplay}`);
console.log(`authDomain: ${firebaseConfig.authDomain}`);
console.log(`projectId: ${firebaseConfig.projectId}`);
console.log(`storageBucket: ${firebaseConfig.storageBucket}`);
console.log(`messagingSenderId: ${firebaseConfig.messagingSenderId}`);
console.log(`appId: ${firebaseConfig.appId}`);
console.log("-----------------------------------------------------------------------");
console.warn("WARNING: Firebase credentials are currently hardcoded in src/lib/firebase/config.ts. This is not recommended for production. Use environment variables (.env.local) for better security.");


let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

export { app, auth };
