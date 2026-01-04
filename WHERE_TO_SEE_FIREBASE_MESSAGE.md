# 📍 Saan Makikita ang Firebase Initialization Message

## 🖥️ Sa Terminal/Console (Backend Server)

Ang message na `✅ Firebase Admin SDK initialized successfully` ay makikita mo sa **terminal/console** kung saan mo in-start ang backend server.

### Step 1: Start ang Backend Server

**Option A: Gamit ang Batch File**
```powershell
.\start_backend.bat
```

**Option B: Gamit ang npm**
```powershell
npm run server
```

**Option C: Direct Node Command**
```powershell
cd server
node index.js
```

### Step 2: Hanapin ang Message sa Console

Kapag nag-start ang server, makikita mo ang output na ganito:

```
🚀 Server is running on http://localhost:5000
✅ Connected to PostgreSQL database
   Database: pest_control
   Server time: 2024-12-26 12:00:00
✅ Firebase Admin SDK initialized successfully    ← ITO ANG MESSAGE!
```

### 📋 Complete Console Output Example:

```
🚀 Server is running on http://localhost:5000
✅ Connected to PostgreSQL database
   Database: pest_control
   Server time: 2024-12-26 12:00:00
✅ Firebase Admin SDK initialized successfully
```

### ⚠️ Kung Hindi Makita ang Message:

**Kung makikita mo ang:**
```
⚠️  Firebase credentials not found. OTP will use database only.
```

**Ibig sabihin:**
- Hindi naka-load ang `.env` file
- O kulang ang Firebase credentials
- Check ang `server/.env` file

**Kung makikita mo ang:**
```
❌ Firebase Admin SDK initialization error: [error message]
```

**Ibig sabihin:**
- May error sa Firebase configuration
- Check ang error message para sa details
- Verify ang Firebase credentials sa `.env` file

### 🔍 Paano i-Verify:

1. **Open ang Terminal/Command Prompt**
   - Sa project directory: `C:\xampp\htdocs\pest control`

2. **Start ang Backend Server**
   ```powershell
   npm run server
   ```

3. **Tingnan ang Console Output**
   - Scroll up kung kailangan
   - Hanapin ang Firebase message
   - Dapat makita mo ang `✅ Firebase Admin SDK initialized successfully`

### 📸 Visual Guide:

```
┌─────────────────────────────────────────────┐
│ Terminal/Command Prompt                     │
├─────────────────────────────────────────────┤
│ C:\xampp\htdocs\pest control> npm run server│
│                                              │
│ 🚀 Server is running on http://localhost:5000│
│ ✅ Connected to PostgreSQL database          │
│    Database: pest_control                    │
│    Server time: 2024-12-26 12:00:00         │
│ ✅ Firebase Admin SDK initialized successfully ← ITO!
│                                              │
└─────────────────────────────────────────────┘
```

### 🎯 Quick Test:

Para ma-test kung gumagana ang Firebase:

1. **Start ang backend:**
   ```powershell
   npm run server
   ```

2. **Check ang console output:**
   - Dapat makita mo ang `✅ Firebase Admin SDK initialized successfully`

3. **Kung hindi makita:**
   - Check ang `server/.env` file
   - Verify na tama ang Firebase credentials
   - Restart ang server

### 💡 Tips:

- **Keep ang terminal open** para makita ang logs
- **Scroll up** kung hindi mo makita agad
- **Check ang error messages** kung may problema
- **Restart ang server** pagkatapos mag-update ng `.env` file

---

**Need help?** Check ang `server/FIREBASE_SETUP_COMPLETE.md` para sa troubleshooting guide.





