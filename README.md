## Dwella.ai – Property & Tenant Management Platform

Dwella.ai is a **full-stack property and tenant management web application** built with Next.js, TypeScript, and MongoDB. It provides authentication, role-based dashboards (Landlord / Tenant), tenant and handyman management, issue tracking, notifications, and analytics.

This README covers:
- **What this project does** (current functionality)
- **Technologies used**
- **How to set up the project after cloning** (Windows & macOS, step by step)
- **Environment variables and MongoDB setup**
- **How to run the app locally**

---

## 1. Current Project Functionality

### Public & Marketing
- **Home, Pricing, Features, About** – Marketing pages
- **Demo booking** – Lead capture via `/demo` and subscribe API
- **Authentication** – Signup, login, logout, forgot password, reset password (with email via Nodemailer)

### Role-Based Access
- **Landlord** – Full dashboard: tenants, handymen, issues, management, analytics
- **Tenant** – Dashboard: view issues, add new issues, overview charts

### Dashboard (Protected)
- **Overview** – Role-specific dashboard with charts (Issues chart, Overview chart, Tenant status chart)
- **Tenants** – CRUD for tenants; add tenant modal; link tenants to landlord
- **Handymen** – CRUD for handymen; add handyman modal
- **Issues** – List and manage issues (pending / assigned / rejected); assign handymen; tenants can add issues
- **Add New Issue** – Tenants submit maintenance/issue requests
- **Management** – Property/building management page
- **Profile** – User profile with optional profile image upload and agreement upload

### API Endpoints
- **Auth:** signup, login, logout, me, profile, upload-profile-image, upload-agreement, forgot-password, reset-password
- **Tenants:** GET/POST `/api/tenants`, GET/PUT/DELETE `/api/tenants/[id]`
- **Handymen:** GET/POST `/api/handymen`, GET/PUT/DELETE `/api/handymen/[id]`
- **Issues:** GET/POST `/api/issues`, GET/PUT/DELETE `/api/issues/[id]`
- **Notifications:** GET/POST `/api/notifications`
- **Subscribe:** POST `/api/subscribe` (demo/lead capture)

### Data Models (MongoDB / Mongoose)
- **User** – name, email, password, role (Landlord/Tenant), landlordId, profileImage, phoneNumber, address, agreement, reset tokens, etc.
- **Tenant** – (via User with role Tenant and landlordId)
- **Handyman** – Handyman resource model
- **Issue** – title, description, status (pending/assigned/rejected), tenantId, landlordId, handymanId
- **Notification** – Notifications for users
- **BookDemo** – Demo booking / subscription

### Security & UX
- JWT-based auth with HTTP-only cookies
- Middleware protects `/dashboard/*` and redirects unauthenticated users to login
- Responsive UI with Tailwind CSS; dashboard sidebar adapts to Landlord vs Tenant
- **Global loading indicators** – Top progress bar and full-screen loader on all page navigations (Sign in, Sign up, dashboard links, etc.)

---

## 2. Tech Stack

**Frontend**
- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, tailwind-merge, tailwindcss-animate
- Chart.js, react-chartjs-2 (dashboard analytics)
- Lucide React, React Icons, react-hook-form, axios, nextjs-toploader (navigation loading)

**Backend**
- Next.js API Routes (serverless)
- JWT (jsonwebtoken), bcrypt, cookie handling
- Mongoose ODM, MongoDB

**Email**
- Nodemailer (password reset, etc.)

**Tooling**
- ESLint, eslint-config-next, TypeScript 5

---

## 3. Setup After Cloning the Repo

Follow these steps to run the project locally. Commands are given for **Windows (PowerShell)** and **macOS (Terminal)**.

### Step 1: Prerequisites

Install on your machine:
- **Node.js** (v18 or newer recommended) – [nodejs.org](https://nodejs.org)
- **npm** (included with Node.js)
- **Git**
- **MongoDB** – Either [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud) or [MongoDB Community](https://www.mongodb.com/try/download/community) (local)

### Step 2: Clone the Repository

**Windows (PowerShell):**
```powershell
git clone <YOUR_REPO_URL>
cd Dwella.ai-webapp-1
```

**macOS (Terminal):**
```bash
git clone <YOUR_REPO_URL>
cd Dwella.ai-webapp-1
```

Replace `<YOUR_REPO_URL>` with your actual repository URL (e.g. `https://github.com/your-org/Dwella.ai-webapp-1.git`). Use the folder name that was created by `git clone` if it differs from `Dwella.ai-webapp-1`.

### Step 3: Install Dependencies

From the project root (same folder as `package.json`):

**Windows (PowerShell):**
```powershell
npm install
```

**macOS (Terminal):**
```bash
npm install
```

Wait until all packages are installed (Next.js, React, Mongoose, etc.).

### Step 4: Create Environment File

Create a file named `.env.local` in the project root (same level as `package.json`). This file is not committed to Git.

**Windows (PowerShell):**
```powershell
New-Item -Path .env.local -ItemType File -Force
notepad .env.local
```

**macOS (Terminal):**
```bash
touch .env.local
open -e .env.local
```

(Alternatively use any editor: VS Code, Cursor, etc.)

Paste the following into `.env.local` and replace the placeholder values as described in **Section 4**:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
BASE_URL=http://localhost:3000
NODE_ENV=development
```

### Step 5: Configure MongoDB and Other Variables

- Set **MONGODB_URI** – Use either MongoDB Atlas (cloud) or a local MongoDB instance. See **Section 4** below for Atlas vs local instructions.
- Set **JWT_SECRET** – A long random string (e.g. 32+ characters).

**Generate a random JWT secret (optional):**

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([Guid]::NewGuid().ToString() + [Guid]::NewGuid().ToString()))
```

**macOS (Terminal):**
```bash
openssl rand -base64 32
```

- **SMTP_EMAIL / SMTP_PASSWORD** – Required for “forgot password” emails (e.g. Gmail with an [App Password](https://support.google.com/accounts/answer/185833)).

Save `.env.local` after editing.

### Step 6: Run the Development Server

From the project root:

**Windows (PowerShell):**
```powershell
npm run dev
```

**macOS (Terminal):**
```bash
npm run dev
```

### Step 7: Open the App

In your browser go to:

**http://localhost:3000**

You should see the home page. You can sign up, log in, and use the dashboard (Tenants, Handymen, Issues, Profile, etc.) according to your role.

---

## 4. Environment Variables & MongoDB

### 4.1 Required variables in `.env.local`

| Variable         | Description                                      |
|------------------|--------------------------------------------------|
| `MONGODB_URI`    | MongoDB connection string                        |
| `JWT_SECRET`     | Secret for JWT signing (min 32 characters)      |
| `SMTP_EMAIL`     | Sender email (e.g. Gmail)                        |
| `SMTP_PASSWORD`  | App password for that email                      |
| `BASE_URL`       | App URL, e.g. `http://localhost:3000`            |
| `NODE_ENV`       | `development` or `production`                    |

### 4.2 Option A – MongoDB Atlas (recommended)

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. **Database Access** → Add user (username + password; save the password).
3. **Network Access** → Add IP → “Allow access from anywhere” (`0.0.0.0/0`) for development.
4. **Connect** → Drivers → copy the connection string.
5. In `.env.local` set:
   ```env
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/dwella?retryWrites=true&w=majority
   ```
   Replace `USERNAME`, `PASSWORD`, and cluster host as needed.

### 4.3 Option B – Local MongoDB

**Windows:** Install MongoDB from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community), then in `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/dwella
```

**macOS (with Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Then in `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/dwella
```

---

## 5. Running the Project (Summary)

| Task              | Command        | Notes                          |
|-------------------|----------------|--------------------------------|
| Development       | `npm run dev`  | Runs at http://localhost:3000  |
| Production build  | `npm run build`| Build for production           |
| Production run    | `npm start`    | After `npm run build`          |
| Lint              | `npm run lint` | ESLint                         |

**Windows and macOS:** use the same commands in PowerShell or Terminal from the project root.

---

## 6. Project Structure (High Level)

```text
app/
  loading.tsx      # Full-screen loader during page transitions
  api/
    auth/          # signup, login, logout, me, profile, upload-profile-image, upload-agreement, forgot-password, reset-password
    tenants/       # CRUD tenants
    handymen/      # CRUD handymen
    issues/        # CRUD issues
    notifications/ # Notifications
    subscribe/     # Demo/lead subscribe
  dashboard/       # Protected dashboard (overview, tenants, handyman, issues, add issue, management, profile)
  login, signup, forgot-password, reset-password, pricing, features, demo, about
components/        # Dashboard layout, modals, charts (IssuesChart, OverviewChart, TenantStatusChart), etc.
lib/               # DB connection, auth helpers (e.g. getAuthUser)
models/            # User, Handyman, Issue, Notification, BookDemo (Mongoose)
constants/         # routes.ts, apiRoutes.ts, assets
middleware.ts      # Protects /dashboard/*, redirects to login if not authenticated
```

---

## 7. Verifying Setup

1. Open http://localhost:3000 → home page loads.
2. Sign up (e.g. name, email, password) → user created; you can log in.
3. Log in → redirect to dashboard; sidebar shows links by role (Landlord vs Tenant).
4. As Landlord: open Tenants, Handyman, Issues; add a tenant or handyman; view charts.
5. As Tenant: open Issues, Add New Issue; submit an issue and see it on the dashboard.

Protected routes redirect to `/login` if you are not logged in.

---

## 8. Git & Secrets

- **Do not commit** `.env.local` (it is in `.gitignore`). It contains secrets (MongoDB, JWT, SMTP).
- Profile images and uploaded agreements are stored outside the repo (e.g. `public/profile-images/` can be gitignored).
- Only share code and non-sensitive config; each developer sets their own `.env.local` using this README.

---

## 9. Quick Reference – Setup Checklist

- [ ] Node.js v18+ and npm installed  
- [ ] Repo cloned, `cd` into project folder  
- [ ] `npm install` run  
- [ ] `.env.local` created with `MONGODB_URI`, `JWT_SECRET`, `SMTP_EMAIL`, `SMTP_PASSWORD`, `BASE_URL`, `NODE_ENV`  
- [ ] MongoDB Atlas or local MongoDB configured and running  
- [ ] `npm run dev` run  
- [ ] http://localhost:3000 opened in browser  

This is a [Next.js](https://nextjs.org) project bootstrapped with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
