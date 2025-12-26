import admin from 'firebase-admin'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get current directory and load .env from server directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const serverDir = dirname(__dirname) // Go up one level from config/ to server/
dotenv.config({ path: join(serverDir, '.env') })

// Initialize Firebase Admin SDK
let firebaseApp

try {
  // Check if Firebase credentials are provided
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    })
    console.log('✅ Firebase Admin SDK initialized successfully')
  } else {
    console.log('⚠️  Firebase credentials not found. OTP will use database only.')
  }
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization error:', error.message)
  console.log('⚠️  Continuing without Firebase. OTP will use database only.')
}

export { admin, firebaseApp }




