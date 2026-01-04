# How to Run the Frontend Server in Visual Studio Code

## Quick Start

1. **Open Terminal in VS Code**
   - Press `Ctrl + `` (backtick) or
   - Go to: Terminal → New Terminal

2. **Run the dev server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   - Go to: http://localhost:5173/

## Alternative Methods

### Method 1: Using VS Code Terminal
- Open terminal (Ctrl + `)
- Type: `npm run dev`
- Wait for "Local: http://localhost:5173/"

### Method 2: Using NPM Scripts
- Press `Ctrl + Shift + P`
- Type: `Tasks: Run Task`
- Select: `npm: dev`

### Method 3: Using Batch File
- Double-click `start_frontend.bat` in File Explorer
- Or run in terminal: `start_frontend.bat`

## Troubleshooting

### If you get "command not found" or errors:
1. Make sure you're in the project directory:
   ```bash
   cd "C:\xampp\htdocs\pest control"
   ```

2. Install dependencies first:
   ```bash
   npm install
   ```

3. Then run:
   ```bash
   npm run dev
   ```

### If port 5173 is already in use:
- The server will automatically use the next available port
- Check the terminal output for the new port number

## Server Details
- **Port**: 5173 (default)
- **URL**: http://localhost:5173/
- **Hot Reload**: Enabled (changes auto-refresh)

## To Stop the Server
- Press `Ctrl + C` in the terminal


