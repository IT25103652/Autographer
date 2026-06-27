# 🎨 Autographer AI Photo Studio

A premium, glassmorphic AI-powered photo transformation platform built with Next.js, TypeScript, Tailwind CSS, and Appwrite. Transform ordinary selfies into professional studio-quality photos using 5 intelligent AI engines.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)
![Appwrite](https://img.shields.io/badge/Appwrite-1.5-f02e65?style=flat-square&logo=appwrite)

## ✨ Features

### 🤖 AI Tools
- **AI Photo Generator** - Transform selfies into wedding, graduation, or executive portraits (3 credits)
- **AI Style Transfer** - Clone lighting, colors, and camera mood from reference images (2 credits)
- **AI Photo Enhancer** - Restore blur, reduce noise, upscale to 4K (1 credit)
- **Background Swap** - Replace backgrounds with luxury environments (2 credits)
- **Object Replacement** - Swap outfits, accessories, and hairstyles (5 credits)

### 🌐 Ecosystem
- **Creator Marketplace** - Browse and purchase community-created AI themes
- **Photographer Directory** - Find and book professional local photographers
- **Referral System** - Earn 20 free credits per friend referred

### 👥 User Roles
- **Client** - Access all AI tools and marketplace
- **Seller** - Create and sell custom AI themes
- **Photographer** - List photography services and receive bookings
- **Admin** - Monitor platform metrics and manage approvals

### 🎨 Design
- Premium glassmorphic dark-mode UI
- Purple-indigo glowing aesthetic
- Responsive layouts for all devices
- Smooth animations and micro-interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/autographer.git
cd autographer

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Configure your `.env.local` file (see `.env.example` for full list):

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── layout.tsx     # Public layout with navbar/footer
│   │   ├── page.tsx       # Homepage
│   │   ├── features/      # AI tools showcase
│   │   ├── pricing/       # Pricing plans
│   │   ├── marketplace/   # Creator marketplace
│   │   └── photographers/ # Photographer directory
│   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── layout.tsx     # Dashboard layout with sidebar
│   │   ├── dashboard/     # User dashboard
│   │   │   ├── page.tsx   # Overview
│   │   │   ├── tools/     # AI tools
│   │   │   └── referrals/ # Referral portal
│   │   └── admin/        # Admin panel
│   ├── login/            # Authentication page
│   └── globals.css       # Global styles
├── components/
│   └── layout/           # Layout components (Navbar, Footer)
├── context/
│   ├── AuthContext.tsx   # Authentication state
│   └── AppContext.tsx    # Application state
└── lib/
    ├── api.ts            # Unified API layer
    ├── appwrite.ts       # Appwrite SDK setup
    └── mockData.ts       # Mock data for development
```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Mock Mode

The application runs in **Mock Mode** by default when Appwrite credentials are not configured. This allows you to:
- Test all features without setting up a backend
- Use localStorage for data persistence
- Preview AI generation workflows with mock data

To enable live Appwrite integration, configure the environment variables.

## 📦 Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

### Other Platforms

For detailed deployment instructions to Netlify, DigitalOcean, or other platforms, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### GitHub Student Developer Pack

This project is optimized for use with GitHub Student Developer Pack benefits:
- **Vercel** - Free hosting with automatic deployments
- **DigitalOcean** - $200 credit for infrastructure
- **Appwrite** - Free backend-as-a-service
- **Sentry** - Error monitoring and crash reporting

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Appwrite (Authentication, Database, Storage)
- **Error Monitoring**: Sentry
- **CI/CD**: GitHub Actions
- **Fonts**: Inter & Outfit (Google Fonts)

## 📱 Features Overview

### Public Pages
- Homepage with interactive before/after slider
- Features showcase with AI tool demonstrations
- Tiered pricing with Stripe/PayHere checkout
- Creator marketplace with filtering and sorting
- Photographer directory with location-based search

### Dashboard
- User overview with stats and quick actions
- "Surprise Me" random AI generation
- All 5 AI tools with progress indicators
- Generation history with download options
- Referral center with link sharing

### Admin Panel
- Platform metrics and analytics
- System status monitoring
- Transaction logs
- Quick admin actions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com)
- Backend powered by [Appwrite](https://appwrite.io)
- Error monitoring by [Sentry](https://sentry.io)
- Placeholder images from [Unsplash](https://unsplash.com)

---

**Built with ❤️ using the GitHub Student Developer Pack**
