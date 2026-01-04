# Backend Environment Variables Setup

## 📋 Paano i-setup ang .env file para sa backend

### Step 1: Create .env file

Gumawa ng `.env` file sa `server` directory. Copy mo ang template sa ibaba:

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# DATABASE CONFIGURATION (PostgreSQL)
# ============================================
DB_USER=postgres
DB_HOST=localhost
DB_NAME=pest_control
DB_PASSWORD=postgres
DB_PORT=5432

# ============================================
# JWT SECRET KEY
# ============================================
# Generate a secure random string for production
# You can use: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# ============================================
# FIREBASE ADMIN SDK CONFIGURATION
# ============================================
# Get these from Firebase Console:
# 1. Go to Firebase Console → Project Settings → Service Accounts
# 2. Click "Generate new private key"
# 3. Download the JSON file
# 4. Copy the values below

# Your Firebase Project ID (e.g., "pest-control-services")
FIREBASE_PROJECT_ID=your-firebase-project-id

# Service Account Private Key (from the downloaded JSON file)
# Keep the quotes and include the entire key including BEGIN/END lines
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Service Account Client Email (from the downloaded JSON file)
# Format: firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# ============================================
# TWILIO SMS SERVICE (Optional - for SMS OTP)
# ============================================
# Get these from Twilio Console: https://console.twilio.com/
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# ============================================
# GMAIL SMTP CONFIGURATION (Optional - for email)
# ============================================
# For sending emails via Gmail
# You need to generate an App Password from Google Account settings
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

### Step 2: Update ang values

#### Database (Required)
- `DB_USER` - PostgreSQL username (default: postgres)
- `DB_HOST` - Database host (default: localhost)
- `DB_NAME` - Database name (default: pest_control)
- `DB_PASSWORD` - PostgreSQL password
- `DB_PORT` - PostgreSQL port (default: 5432)

#### JWT Secret (Required)
- `JWT_SECRET` - Secret key para sa JWT tokens
  - Para sa production, generate ng secure random string:
  ```bash
  openssl rand -base64 32
  ```

#### Firebase (Optional - pero recommended)
Para makuha ang Firebase credentials:

1. **Pumunta sa Firebase Console:**
   - https://console.firebase.google.com/
   - Select ang project mo

2. **Get Service Account Key:**
   - Project Settings (⚙️ icon) → Service Accounts tab
   - Click "Generate new private key"
   - Download ang JSON file

3. **Copy ang values:**
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and \n)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

**Example ng Firebase Private Key format:**
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

#### Twilio (Optional - para sa SMS OTP)
Kung gusto mong gumamit ng SMS OTP:
- Sign up sa https://www.twilio.com/
- Get Account SID, Auth Token, at Phone Number
- I-update ang values sa `.env`

#### Gmail (Optional - para sa email)
Kung gusto mong mag-send ng emails:
- Enable 2-Factor Authentication sa Google Account
- Generate App Password: https://myaccount.google.com/apppasswords
- I-update ang `GMAIL_USER` at `GMAIL_APP_PASSWORD`

### Step 3: Test ang configuration

After i-setup ang `.env` file:

1. **Restart ang backend server:**
   ```bash
   npm run server
   ```

2. **Check ang console output:**
   - Makikita mo ang: `✅ Firebase Admin SDK initialized successfully` (kung configured)
   - O kaya: `⚠️ Firebase credentials not found` (kung hindi pa configured)

### ⚠️ Important Notes

1. **Security:**
   - `.env` file ay nasa `.gitignore` - hindi ma-commit sa git
   - Huwag i-share ang `.env` file
   - Para sa production, use secure environment variables

2. **Required vs Optional:**
   - **Required:** Database, JWT_SECRET
   - **Optional:** Firebase, Twilio, Gmail (gumagana pa rin ang app kahit wala)

3. **Current Setup:**
   - Kahit walang Firebase/Twilio/Gmail, gumagana pa rin ang app
   - Backend ay may fallback mechanisms

### 🔍 Quick Check

Para malaman kung configured na ang Firebase:
- Check ang console kapag nag-start ang server
- O kaya test ang OTP functionality
- Makikita mo ang Firebase logs kung configured

---

**Need help?** Check ang `FIREBASE_ACCESS_GUIDE.md` para sa detailed Firebase setup instructions.





