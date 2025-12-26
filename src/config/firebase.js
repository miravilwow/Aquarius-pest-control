import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
let app
let auth
let recaptchaVerifier

try {
  // Check if Firebase config values are provided (not undefined or empty)
  const hasApiKey = firebaseConfig.apiKey && 
                    firebaseConfig.apiKey !== 'undefined' &&
                    typeof firebaseConfig.apiKey === 'string' &&
                    firebaseConfig.apiKey.trim() !== ''
  
  const hasProjectId = firebaseConfig.projectId && 
                       firebaseConfig.projectId !== 'undefined' &&
                       typeof firebaseConfig.projectId === 'string' &&
                       firebaseConfig.projectId.trim() !== ''
  
  if (hasApiKey && hasProjectId) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    console.log('✅ Firebase initialized successfully')
  } else {
    console.log('⚠️  Firebase config not found. OTP will use backend API.')
    auth = null
    app = null
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error)
  console.log('⚠️  Continuing without Firebase. OTP will use backend API.')
  auth = null
  app = null
}

// Initialize reCAPTCHA verifier
export const initializeRecaptcha = (containerId = 'recaptcha-container') => {
  if (!auth) {
    return null
  }

  try {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA verified')
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired')
      }
    })
    return recaptchaVerifier
  } catch (error) {
    console.error('reCAPTCHA initialization error:', error)
    return null
  }
}

export { app, auth, recaptchaVerifier }
export default app

