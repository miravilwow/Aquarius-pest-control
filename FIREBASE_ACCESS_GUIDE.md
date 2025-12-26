# Firebase Access Guide - Pest Control Project

## 🔥 Paano ma-access ang Firebase Project mo

### Option 1: Access sa Firebase Console (Web)

1. **Pumunta sa Firebase Console:**
   - Buksan ang browser at pumunta sa: https://console.firebase.google.com/
   - Sign in gamit ang Google account mo

2. **Hanapin ang Project:**
   - Makikita mo lahat ng Firebase projects mo sa dashboard
   - Hanapin ang project na ginagamit mo para sa Pest Control project
   - Click ang project name para ma-access

3. **Check Project ID:**
   - Sa Project Settings (⚙️ icon sa left sidebar)
   - Makikita mo ang **Project ID** sa General tab
   - Ito ang kailangan mo para sa `.env` file

### Option 2: Check kung may existing Firebase Project

Kung may existing Firebase project ka na, maaari mong i-check:

1. **Sa Firebase Console:**
   - Lahat ng projects mo ay makikita sa dashboard
   - May project name at project ID

2. **Sa Code:**
   - Check mo ang `.env` file (kung meron)
   - O kaya sa environment variables

### Option 3: Setup ng Firebase para sa Project na ito

Kung wala ka pang Firebase project para dito, pwede mong gawin:

#### Step 1: Create Firebase Project
1. Pumunta sa https://console.firebase.google.com/
2. Click "Add project" o "Create a project"
3. I-name mo: `pest-control-services` o kung ano gusto mo
4. Sundin ang setup wizard

#### Step 2: Get Firebase Config
1. Sa Firebase Console, pumunta sa Project Settings (⚙️)
2. Scroll down sa "Your apps" section
3. Click ang Web icon (</>) para mag-add ng web app
4. I-register ang app name
5. Copy ang Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   }
   ```

#### Step 3: Setup Environment Variables

**Para sa Frontend (src/config/firebase.js):**
Gumawa ng `.env` file sa root directory:
```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Para sa Backend (server/config/firebase.js):**
Dagdag sa `.env` file sa server directory:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

Para sa backend, kailangan mo ng **Service Account Key**:
1. Sa Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download ang JSON file
4. Copy ang values sa `.env` file

### 📋 Current Status ng Project

**Firebase Configuration:**
- ✅ May Firebase config files (`src/config/firebase.js` at `server/config/firebase.js`)
- ✅ May Firebase packages installed (`firebase` at `firebase-admin`)
- ❌ Wala pang `.env` files (kaya hindi pa configured)

**Ginagamit ang Firebase para sa:**
- Phone OTP Authentication (Firebase Auth)
- reCAPTCHA verification

### 🔍 Paano malaman kung may existing Firebase Project ka

1. **Check sa Firebase Console:**
   - Login sa https://console.firebase.google.com/
   - Makikita mo lahat ng projects mo

2. **Check sa code:**
   - Hanapin ang `.env` files
   - O kaya check ang git history kung may naka-commit na credentials (hindi recommended)

3. **Check sa browser console:**
   - Kapag nag-run ang app, check ang console
   - Makikita mo ang message: `✅ Firebase initialized successfully` o `⚠️ Firebase config not found`

### ⚠️ Important Notes

1. **Security:**
   - Huwag i-commit ang `.env` files sa git
   - Lagyan ng `.env` sa `.gitignore`

2. **Current Setup:**
   - Kahit walang Firebase, gumagana pa rin ang app
   - Gumagamit ng backend API para sa OTP (Twilio/SMS)

3. **Firebase Features:**
   - Phone Authentication (OTP)
   - reCAPTCHA
   - (Optional) Firestore database
   - (Optional) Cloud Storage

### 🚀 Next Steps

1. **Kung may existing Firebase project ka:**
   - Copy ang credentials sa `.env` files
   - Restart ang dev server

2. **Kung wala pang Firebase project:**
   - Create ng bagong project sa Firebase Console
   - Setup ang credentials
   - Enable Phone Authentication sa Firebase Console

3. **Test:**
   - After setup, check ang console kung successful ang initialization
   - Test ang OTP functionality

---

**Need help?** Check ang Firebase documentation: https://firebase.google.com/docs


