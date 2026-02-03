# Vercel Deployment Guide for Frontend

## 🚀 Quick Deploy Steps

1. **Push your code to GitHub** (if not already done)
2. **Go to [vercel.com](https://vercel.com)** and sign in
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Configure the project** (see below)
6. **Deploy!**

## ⚙️ Vercel Project Configuration

### Build Settings

Vercel should auto-detect Next.js, but verify:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (root of your repo)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

## 🔐 Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

### ✅ Required (Optional but Recommended)

**None required!** Your frontend automatically detects production vs development based on the hostname.

However, if you want to override the backend URL, you can add:

```
NEXT_PUBLIC_API_URL=https://certifurb-backend.onrender.com
```

### ❌ Optional Environment Variables

#### Exchange Rate API (if you use currency conversion)
```
NEXT_PUBLIC_EXCHANGE_RATE=your_exchange_rate_api_key
```

**Note:** Only add this if you're using the currency conversion feature in `CurrencyContext.jsx`.

### 📝 How Environment Detection Works

Your frontend uses `app/config/environment.js` which automatically:
- ✅ Detects `localhost` → uses development backend (`http://192.168.100.18:5000`)
- ✅ Detects production domain → uses production backend (`https://certifurb-backend.onrender.com`)

**No environment variables needed** unless you want to override the backend URL!

## 🎯 After Deployment

1. **Get your Vercel URL** (e.g., `https://certifurb.vercel.app`)
2. **Update backend CORS** to include your Vercel URL:
   - Go to Render dashboard
   - Update environment variables or redeploy with new CORS settings
   - Add your Vercel URL to the CORS origins

3. **Test your deployment:**
   - Visit your Vercel URL
   - Check browser console for errors
   - Test API calls

## 🔧 Updating Backend CORS for Vercel

After you get your Vercel URL, update `backend/server.js`:

```javascript
// Add your Vercel URL to CORS origins
origin: [
  "https://certifurb.com", 
  "https://www.certifurb.com", 
  "http://localhost:3000",
  "https://certifurb-backend.onrender.com",
  "https://your-app.vercel.app"  // ← Add your Vercel URL here
],
```

Then redeploy your backend to Render.

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Build settings verified (auto-detected Next.js)
- [ ] Environment variables added (if needed)
- [ ] First deployment successful
- [ ] Got Vercel URL
- [ ] Updated backend CORS with Vercel URL
- [ ] Tested frontend → backend connection
- [ ] Tested API calls work
- [ ] Tested WebSocket connections (if applicable)

## 🐛 Troubleshooting

### Build Fails

1. **Check build logs** in Vercel dashboard
2. **Common issues:**
   - Missing dependencies → Check `package.json`
   - TypeScript errors → Fix type errors
   - Import errors → Check file paths

### API Calls Fail

1. **Check CORS** - Make sure your Vercel URL is in backend CORS
2. **Check backend URL** - Verify `https://certifurb-backend.onrender.com` is accessible
3. **Check browser console** - Look for CORS or network errors

### Environment Variables Not Working

- **Next.js rule:** Only variables starting with `NEXT_PUBLIC_` are exposed to the browser
- **Restart deployment** after adding new environment variables
- **Check** that variables are set for the correct environment (Production/Preview/Development)

## ✅ That's It!

Your frontend should deploy successfully to Vercel. The automatic environment detection means it will:
- Use development backend when running locally
- Use production backend when deployed to Vercel

No environment variables needed unless you want to customize the backend URL!
