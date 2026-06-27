# 🚀 Deployment Guide - Autographer AI Photo Studio

This comprehensive guide covers deploying the Autographer AI Photo Studio to production using **GitHub Student Developer Pack** benefits on platforms like **Netlify**, **Vercel**, or **DigitalOcean App Platform**.

---

## 📋 Prerequisites

- GitHub account with Student Developer Pack activated
- Node.js 18+ installed locally
- Git installed and configured
- Appwrite Cloud account (free tier available)
- Sentry account (free tier available)

---

## 🔧 Local Build Validation

Before deploying, validate your local build:

```bash
# Install dependencies
npm install

# Run type checking
npx tsc --noEmit

# Run linter
npm run lint

# Production build
npm run build

# Test production build locally
npm run start
```

Visit `http://localhost:3000` to verify the application works correctly.

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Why Vercel:** Native Next.js support, automatic HTTPS, global CDN, free tier for students.

#### Step 1: Connect Repository

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Click "Add New Project" → "Import Git Repository"
4. Select your `Autographer A1` repository

#### Step 2: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### Step 3: Deploy

1. Click "Deploy"
2. Vercel will automatically build and deploy
3. Your app will be live at `https://your-app.vercel.app`

#### Step 4: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

### Option 2: Netlify (Great for Static Sites)

**Why Netlify:** Free hosting, form handling, edge functions, GitHub Student Pack credits.

#### Step 1: Build Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Step 2: Connect Repository

1. Go to [netlify.com](https://netlify.com) and sign up with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select your GitHub repository

#### Step 3: Configure Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `.next`

#### Step 4: Environment Variables

Add in Site Settings → Environment Variables:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

#### Step 5: Deploy

Click "Deploy site" - Netlify will build and deploy automatically.

---

### Option 3: DigitalOcean App Platform

**Why DigitalOcean:** Full control, $200 credit for students, scalable infrastructure.

#### Step 1: Prepare for Deployment

Ensure your `package.json` has:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

#### Step 2: Create App

1. Go to [DigitalOcean Dashboard](https://cloud.digitalocean.com)
2. Navigate to Apps → Create App
3. Select your GitHub repository
4. Choose branch (usually `main`)

#### Step 3: Configure Build Settings

- **Build command:** `npm run build`
- **Run command:** `npm start`
- **Output directory:** `.next`

#### Step 4: Environment Variables

Add in the App Settings:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NODE_ENV=production
```

#### Step 5: Resource Allocation

For a Next.js app, recommended minimum:
- **CPU:** 0.5 vCPU (Basic)
- **RAM:** 512MB (Basic)
- **Storage:** 1GB

#### Step 6: Deploy

Click "Create App" - DigitalOcean will build and deploy.

---

## 🔐 Appwrite Setup (Backend)

### Step 1: Create Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project named "Autographer"
3. Copy your Project ID and Endpoint

### Step 2: Create Databases

Create the following collections:

- **Users** (for user profiles)
- **Themes** (for AI themes)
- **Sellers** (for creator marketplace)
- **Photographers** (for photographer ads)
- **Transactions** (for credit history)
- **Generations** (for user generations)

### Step 3: Configure Authentication

1. Enable Email/Password authentication
2. Enable Google OAuth (optional)
3. Set up JWT settings

### Step 4: Update Environment Variables

Add your Appwrite credentials to your deployment platform's environment variables.

---

## 📊 Sentry Setup (Error Monitoring)

### Step 1: Create Sentry Project

1. Go to [Sentry.io](https://sentry.io)
2. Create a new project → Select "Next.js"
3. Copy your DSN

### Step 2: Configure Sentry

Your Sentry configuration is already set up in:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

### Step 3: Add Environment Variables

```bash
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

---

## 🧪 Testing After Deployment

### Critical Path Testing

1. **Authentication Flow**
   - Sign up as new user
   - Login with existing credentials
   - Logout functionality

2. **AI Tools (Mock Mode)**
   - Navigate to Dashboard
   - Test AI Photo Generator
   - Test Style Transfer
   - Test Photo Enhancer
   - Test Background Swap
   - Test Object Replacement

3. **Credit System**
   - View credit balance
   - Test credit deduction on generation
   - Test credit purchase flow

4. **Public Pages**
   - Homepage loads correctly
   - Features page displays
   - Pricing page works
   - Marketplace loads
   - Photographer directory works

5. **Admin Panel**
   - Switch to admin role via sandbox
   - View platform metrics
   - Test admin actions

---

## 🔄 CI/CD with GitHub Actions

Your `.github/workflows/ci.yml` is already configured to:

- Run TypeScript compilation checks
- Run ESLint validation
- Test build process

This runs automatically on every push and pull request.

---

## 📱 Performance Optimization

### Image Optimization

Unsplash images are already configured in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
      port: "",
      pathname: "/**",
    },
  ],
}
```

### Build Optimization

The application uses:
- Automatic code splitting
- Static generation where possible
- Edge runtime for API routes
- Tree shaking for unused code

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Environment Variables Not Loading

- Ensure variables are set in deployment platform settings
- Restart the deployment after adding variables
- Check variable names match exactly (case-sensitive)

### Images Not Loading

- Verify `next.config.ts` has Unsplash in remotePatterns
- Check image URLs are accessible
- Ensure images.unsplash.com is not blocked by firewall

### Appwrite Connection Issues

- Verify Appwrite endpoint is correct
- Check Project ID matches
- Ensure API key has proper permissions
- Test Appwrite connection locally first

---

## 📈 Monitoring

### Sentry Error Tracking

- Monitor errors in real-time
- Set up alert rules for critical issues
- Track performance metrics

### Appwrite Console

- Monitor database usage
- Track API call counts
- View authentication logs

---

## 🔒 Security Best Practices

1. **Never commit** `.env.local` or real API keys
2. Use environment variables for all sensitive data
3. Enable HTTPS in production (automatic on Vercel/Netlify)
4. Regularly update dependencies
5. Monitor Sentry for security issues
6. Use Appwrite's built-in security features

---

## 📞 Support

For issues with:
- **Deployment:** Platform-specific documentation
- **Appwrite:** [Appwrite Docs](https://appwrite.io/docs)
- **Sentry:** [Sentry Docs](https://docs.sentry.io)
- **Next.js:** [Next.js Docs](https://nextjs.org/docs)

---

## ✅ Deployment Checklist

- [ ] Local build passes (`npm run build`)
- [ ] Environment variables configured
- [ ] Appwrite project set up
- [ ] Sentry project configured
- [ ] Repository pushed to GitHub
- [ ] Deployment platform connected
- [ ] Build successful on platform
- [ ] Custom domain configured (optional)
- [ ] Critical paths tested
- [ ] Error monitoring active
- [ ] Analytics configured (optional)

---

**Congratulations! 🎉 Your Autographer AI Photo Studio is now live!**
