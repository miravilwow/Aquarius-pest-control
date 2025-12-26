# How to Open Browser Console and Run Commands

## Step-by-Step Guide:

### 1. Open Your Browser
- Chrome, Edge, Firefox, or any browser

### 2. Open Developer Tools / Console
**Method 1: Keyboard Shortcut (EASIEST)**
- Press `F12` key
- Or press `Ctrl + Shift + I` (Windows)
- Or press `Ctrl + Shift + J` (Windows - opens Console directly)

**Method 2: Right-Click Method**
- Right-click anywhere on the page
- Click "Inspect" or "Inspect Element"
- Then click the "Console" tab

**Method 3: Menu Method**
- Click the 3 dots menu (⋮) in browser
- Go to "More tools" → "Developer tools"
- Click "Console" tab

### 3. You Should See Console Tab
- May makikita kang black/white area sa baba o sa gilid
- May "Console" tab na dapat naka-select
- May ">" prompt kung saan ka magta-type

### 4. Type or Paste the Commands
Copy and paste these one by one (or all at once):

```javascript
document.querySelector('.home').style.opacity = '1'
document.querySelector('.home').style.visibility = 'visible'
document.querySelector('.home').style.display = 'block'
```

### 5. Press Enter
- After pasting, press `Enter`
- Dapat makita mo na ang content!

---

## Visual Guide:

```
Browser Window
┌─────────────────────────────────┐
│  [Address Bar: localhost:5173] │
├─────────────────────────────────┤
│                                 │
│     Your Page Content          │
│     (should appear here)        │
│                                 │
├─────────────────────────────────┤
│ Console Tab ▼                  │
│ > document.querySelector...    │ ← Type here
│   (press Enter)                 │
└─────────────────────────────────┘
```

---

## Alternative: Quick Test

If console is hard to find, try this:

1. **Right-click** sa page
2. Click **"Inspect"**
3. Sa **Elements** tab, hanapin ang `<div class="home">`
4. Right-click → **"Edit as HTML"**
5. Add `style="opacity: 1 !important; visibility: visible !important; display: block !important;"`

---

## What You Should See:

After running the commands, dapat:
- ✅ Content appears immediately
- ✅ No errors in console
- ✅ Page shows all sections

---

## If Still Not Working:

Share with me:
1. Screenshot ng console (F12)
2. Any red error messages
3. What you see in Elements tab


