# Debug: Blank White Page Issue

## Steps to Debug:

1. **Open Browser Console (F12)**
   - Check for JavaScript errors
   - Look for red error messages

2. **Check Network Tab**
   - See if CSS files are loading
   - Check if JS files are loading

3. **Check Elements Tab**
   - See if `<div className="home">` exists
   - Check if content is there but hidden

4. **Try Hard Refresh**
   - Windows: `Ctrl + Shift + R` or `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

5. **Check Terminal**
   - Look for build errors
   - Check if server is running

## Common Issues:

1. **GSAP Import Error** - Fixed with async import
2. **CSS Hiding Content** - Added visibility styles
3. **Component Not Rendering** - Check console for errors

## Quick Fix:

If still blank, try this in browser console:
```javascript
document.querySelector('.home')?.style.display = 'block'
document.querySelector('.home')?.style.visibility = 'visible'
document.querySelector('.home')?.style.opacity = '1'
```


