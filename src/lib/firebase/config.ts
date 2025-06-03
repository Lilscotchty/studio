
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

// These are the default fallback values, inspired by your shared configuration.
// Ideally, all these values should be loaded from environment variables.
const defaultConfig = {
  apiKey: "AIzaSyDLfpHD6tKlxekkYLH6IFRkZxmp2pwhmyM",
  authDomain: "marketvision-ai-26nvv.firebaseapp.com",
  projectId: "marketvision-ai-26nvv",
  storageBucket: "marketvision-ai-26nvv.appspot.com", // Corrected typical storageBucket format
  messagingSenderId: "988146260477",
  appId: "1:988146260477:web:df3078ad6c25421825e194"
};

// Construct the final config, preferring environment variables if they exist.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultConfig.appId,
};

// Enhanced logging to show the source of each config value.
console.log("--- Firebase Configuration ---");
const logSource = (envVarName: string, valueFromEnv: string | undefined, fallbackValue: string, usedValue: string) => {
  if (valueFromEnv && valueFromEnv === usedValue) {
    return `FROM ENV (${envVarName})`;
  }
  if (usedValue === fallbackValue) {
    return `USING FALLBACK (env var ${envVarName} not set or empty)`;
  }
  return 'UNKNOWN SOURCE (this should not happen)';
};

let apiKeyDisplay = firebaseConfig.apiKey;
if (apiKeyDisplay && apiKeyDisplay.length > 10) { // Redact most of the API key for logging
    apiKeyDisplay = `${apiKeyDisplay.substring(0, 5)}...${apiKeyDisplay.slice(-4)}`;
}

console.log(`apiKey: ${apiKeyDisplay} (${logSource('NEXT_PUBLIC_FIREBASE_API_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY, defaultConfig.apiKey, firebaseConfig.apiKey)})`);
console.log(`authDomain: ${firebaseConfig.authDomain} (${logSource('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, defaultConfig.authDomain, firebaseConfig.authDomain)})`);
console.log(`projectId: ${firebaseConfig.projectId} (${logSource('NEXT_PUBLIC_FIREBASE_PROJECT_ID', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, defaultConfig.projectId, firebaseConfig.projectId)})`);
console.log(`storageBucket: ${firebaseConfig.storageBucket} (${logSource('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, defaultConfig.storageBucket, firebaseConfig.storageBucket)})`);
console.log(`messagingSenderId: ${firebaseConfig.messagingSenderId} (${logSource('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, defaultConfig.messagingSenderId, firebaseConfig.messagingSenderId)})`);
console.log(`appId: ${firebaseConfig.appId} (${logSource('NEXT_PUBLIC_FIREBASE_APP_ID', process.env.NEXT_PUBLIC_FIREBASE_APP_ID, defaultConfig.appId, firebaseConfig.appId)})`);
console.log("-----------------------------");

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

export { app, auth };
