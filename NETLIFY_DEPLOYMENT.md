# Deploying to Netlify

This guide will help you deploy your Kabaadi and Co app to Netlify with **secure** API key management.

## Security Architecture

This app uses **Netlify Functions** (serverless functions) to securely proxy API calls to Google Gemini. Your API key is:
- ✅ **Never exposed in the client-side code**
- ✅ **Stored securely as an environment variable** 
- ✅ **Only accessible from the server-side functions**

The frontend makes requests to Netlify Functions (at `/.netlify/functions/gemini`), which then call the Gemini API with your secret key.

## Prerequisites

1. A [Netlify account](https://app.netlify.com/signup) (free tier works fine)
2. Your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. This repository pushed to GitHub/GitLab/Bitbucket

## Step 1: Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

## Step 2: Connect to Netlify

1. Log in to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider and authorize Netlify
4. Select your repository

## Step 3: Configure Build Settings

Netlify will auto-detect the settings from `netlify.toml`, but verify:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Base directory:** (leave empty)

## Step 4: Add Environment Variables (IMPORTANT!)

This is where you securely add your API key:

1. In your site settings, go to **"Site configuration"** → **"Environment variables"**
2. Click **"Add a variable"** → **"Add a single variable"**
3. Add the following:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Your Google Gemini API key
   - **Scopes:** Select all (Production, Deploy previews, Branch deploys)
4. Click **"Create variable"**

## Step 5: Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your site will be live at a Netlify URL like `https://your-site-name.netlify.app`

## Step 6: Custom Domain (Optional)

1. Go to **"Domain management"** in your site settings
2. Click **"Add custom domain"**
3. Follow the instructions to configure your DNS

## Testing Your Deployment

After deployment, test these features to ensure the API key is working:

1. **AI Chatbot** - Click the chat button and ask a question
2. **Scrap Identifier** - Upload an image of scrap material
3. **Value Calculator** - Calculate scrap value

If these features don't work, double-check your environment variable is set correctly.

## Updating Your Deployment

Netlify automatically rebuilds your site when you push to your repository. To update:

1. Make changes locally
2. Commit and push to your repository
3. Netlify will automatically deploy the changes

## Security Notes

✅ **Your API key is secure** - It's stored as an environment variable in Netlify and only used in server-side functions

✅ **Never exposed to clients** - The frontend never has access to your API key; all API calls go through Netlify Functions

✅ **Never commit `.env` files** - The `.gitignore` is already configured to exclude them

✅ **Environment variables are encrypted** - Netlify encrypts all environment variables

## How It Works (Technical)

1. **Frontend** (`index.js`) → Calls API client
2. **API Client** (`services/apiClient.js`) → Makes fetch requests to `/.netlify/functions/gemini`
3. **Netlify Function** (`netlify/functions/gemini.js`) → Receives request, calls Gemini API with your secure API key
4. **Response** flows back through the chain to the user

This architecture ensures your API key never leaves the server environment.

## Troubleshooting

### Build Fails
- Check the build logs in Netlify
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Features Don't Work
- Verify `GEMINI_API_KEY` is set in Netlify environment variables
- Check the browser console for errors
- Ensure your API key is valid and has the correct permissions

### Site Shows Old Version
- Clear your browser cache
- Check if the latest build succeeded in Netlify
- Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Support

For Netlify-specific issues, check:
- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community Forums](https://answers.netlify.com/)

For API key issues:
- [Google AI Studio](https://aistudio.google.com/)
