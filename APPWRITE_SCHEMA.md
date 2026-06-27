# Appwrite Database Schema Documentation

This document outlines the required Appwrite collections, attributes, and storage buckets for the Autographer AI Photo Studio application.

## Prerequisites

1. Create an Appwrite Cloud project at https://cloud.appwrite.io/
2. Set the following environment variables:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
   - `NEXT_PUBLIC_APPWRITE_DATABASE_ID` (default: `ai_photo_studio`)
   - `NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID` (default: `ai-images`)

---

## Database Setup

### 1. Create Database

**Database ID**: `ai_photo_studio`
**Name**: AI Photo Studio Database

---

## Collections

### Collection: `themes`

**Purpose**: Store AI photo themes/presets available for generation

**Attributes**:
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `$id` | string | Auto | Document ID (auto-generated) |
| `name` | string | Yes | Theme name (e.g., "Royal Garden Vows") |
| `category` | string | Yes | Category (e.g., "Wedding", "Business", "Travel") |
| `prompt` | string | Yes | AI prompt for generation |
| `image` | string | Yes | Preview image URL |
| `creditCost` | number | Yes | Credits required to use this theme |
| `authorId` | string | Yes | Creator user ID |
| `authorName` | string | Yes | Creator display name |
| `isPopular` | boolean | No | Mark as popular theme (default: false) |

**Indexes**:
- Index on `category` for filtering
- Index on `isPopular` for featured themes

**Permissions**:
- Read: Any (guests can browse)
- Create: Users (sellers can create themes)
- Update: Document owner + Admin
- Delete: Document owner + Admin

---

### Collection: `sellers`

**Purpose**: Store creator/seller profiles for the marketplace

**Attributes**:
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `$id` | string | Auto | Document ID (auto-generated) |
| `name` | string | Yes | Seller display name |
| `avatar` | string | Yes | Profile image URL |
| `skills` | array | Yes | Array of skill strings |
| `verificationStatus` | enum | Yes | "pending" | "approved" | "rejected" | "none" |
| `earnings` | number | Yes | Total earnings in USD |
| `rating` | number | Yes | Average rating (0-5) |
| `reviewCount` | number | Yes | Number of reviews |
| `portfolio` | array | Yes | Array of portfolio image URLs |

**Indexes**:
- Index on `verificationStatus` for admin approval workflow
- Index on `rating` for sorting

**Permissions**:
- Read: Any
- Create: Users
- Update: Document owner + Admin
- Delete: Document owner + Admin

---

### Collection: `ads` (Photographer Ads)

**Purpose**: Store photographer service advertisements

**Attributes**:
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `$id` | string | Auto | Document ID (auto-generated) |
| `name` | string | Yes | Photographer name |
| `avatar` | string | Yes | Profile image URL |
| `location` | string | Yes | Service location |
| `rating` | number | Yes | Average rating (0-5) |
| `reviewCount` | number | Yes | Number of reviews |
| `price` | string | Yes | Price range (e.g., "$50 - $150 / hr") |
| `status` | enum | Yes | "pending" | "approved" | "rejected" |
| `isSponsored` | boolean | Yes | Mark as sponsored listing |
| `contactEmail` | string | Yes | Contact email |
| `phone` | string | Yes | Contact phone |
| `portfolio` | array | Yes | Array of portfolio image URLs |
| `description` | string | Yes | Service description |

**Indexes**:
- Index on `status` for admin approval
- Index on `isSponsored` for featured listings
- Index on `location` for geographic filtering

**Permissions**:
- Read: Any
- Create: Users
- Update: Document owner + Admin
- Delete: Document owner + Admin

---

### Collection: `generations`

**Purpose**: Store user AI generation history

**Attributes**:
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `$id` | string | Auto | Document ID (auto-generated) |
| `userId` | string | Yes | User who created the generation |
| `tool` | enum | Yes | "generator" | "style-transfer" | "enhancer" | "background" | "object-replacement" |
| `beforeUrl` | string | Yes | Original image URL (from storage) |
| `afterUrl` | string | Yes | Generated image URL (from storage) |
| `themeName` | string | No | Theme/style name used |
| `createdAt` | string | Yes | ISO timestamp |

**Indexes**:
- Index on `userId` for user history
- Index on `createdAt` for sorting
- Index on `tool` for filtering by tool type

**Permissions**:
- Read: Document owner only
- Create: Users
- Update: Document owner
- Delete: Document owner

---

### Collection: `transactions`

**Purpose**: Store credit transaction history

**Attributes**:
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `$id` | string | Auto | Document ID (auto-generated) |
| `userId` | string | Yes | User who made the transaction |
| `type` | enum | Yes | "purchase" | "spend" | "referral_reward" | "seller_earning" |
| `credits` | number | Yes | Credit amount (positive for gain, negative for spend) |
| `amount` | number | No | USD amount for purchases |
| `description` | string | Yes | Transaction description |
| `date` | string | Yes | ISO timestamp |

**Indexes**:
- Index on `userId` for user history
- Index on `date` for sorting
- Index on `type` for filtering

**Permissions**:
- Read: Document owner only
- Create: System (via API)
- Update: System only
- Delete: System only

---

## Storage Buckets

### Bucket: `ai-images`

**Bucket ID**: `ai-images`
**Name**: AI Generated Images

**Purpose**: Store uploaded source images and generated output images

**File Permissions**:
- Read: Any (for public preview URLs)
- Create: Users
- Update: File owner
- Delete: File owner + Admin

**Allowed File Types**:
- `image/jpeg`
- `image/png`
- `image/webp`

**Max File Size**: 10MB

---

## User Preferences (Account Prefs)

Store user-specific data in Appwrite Account Preferences:

| Preference | Type | Description |
|------------|------|-------------|
| `credits` | number | Current credit balance |
| `plan` | string | Subscription plan: "Free" | "Premium" | "Pro" |
| `role` | enum | User role: "user" | "seller" | "photographer" | "admin" |

---

## Setup Steps

1. **Create Database**:
   - Go to Databases → Create Database
   - ID: `ai_photo_studio`
   - Name: `AI Photo Studio Database`

2. **Create Collections** (in order):
   - `themes`
   - `sellers`
   - `ads`
   - `generations`
   - `transactions`

3. **Create Storage Bucket**:
   - Go to Storage → Create Bucket
   - ID: `ai-images`
   - Name: `AI Generated Images`

4. **Set Permissions**:
   - Configure collection and bucket permissions as documented above
   - Ensure proper read/write access for different user roles

5. **Seed Initial Data** (Optional):
   - Use the mock data from `src/lib/mockData.ts` to populate initial themes, sellers, and photographers

---

## Migration from Mock Mode

When switching from localStorage to Appwrite:

1. Export existing localStorage data (if any)
2. Import data into corresponding Appwrite collections
3. Update environment variables with Appwrite credentials
4. The API layer will automatically switch to Appwrite when credentials are detected

---

## Security Notes

- Never commit `.env.local` with real credentials
- Use Appwrite's built-in permission system for data access control
- Implement proper authentication checks in API routes
- Use Appwrite's server-side API key for privileged operations
