# ♾️ Meta Accounts Center - Technical Breakdown & Interview Prep Guide

**Project**: Meta Accounts Center Clone  
**Company**: Red Software Developer Assignment  
**GitHub Repository**: [https://github.com/ashribad1234/MetaApplicationCenter](https://github.com/ashribad1234/MetaApplicationCenter)  
**Live Application URL**: [https://meta-application-center.vercel.app](https://meta-application-center.vercel.app)  
**Interactive API Docs**: [https://meta-application-center.vercel.app/api-docs](https://meta-application-center.vercel.app/api-docs)  

---

## 🛠️ Section 1: Complete Tech Stack & Packages Installed

### 1. **Core Frameworks**
* **Next.js 14 (App Router)**: Full-stack framework combining React frontend pages and serverless REST API backend routes (`src/app/api/...`).
* **TypeScript 5**: Ensures complete type-safety across database models, API payloads, and frontend state.
* **React 18**: Client-side library for building dynamic and responsive UI components.

### 2. **Database & Backend Utilities**
* **Prisma ORM (v5.10)**: Object-Relational Mapping library used to define database schemas, manage migrations, and run type-safe queries.
* **SQLite (`prisma/dev.db`)**: Relational database file stored locally (compatible with PostgreSQL/MySQL).
* **`bcryptjs`**: Cryptographic password hashing library using 10 salt rounds for secure password storage.
* **`jose` & `jsonwebtoken`**: Cryptographic JWT (JSON Web Token) libraries used for signing and verifying tokens stored in HTTP-Only cookies.

### 3. **Frontend Styling & UI**
* **Tailwind CSS v3**: Utility-first styling framework with Meta colors (`#1877F2`) and Dark Mode support.
* **Lucide React (`lucide-react`)**: Modern SVG icon set used across navigation, buttons, and modals.
* **React Context API**: `AuthProvider` and `ThemeProvider` for global auth state and dark mode management.

### 4. **API Docs & DevOps**
* **`swagger-ui-react`**: Renders an interactive Swagger UI page at `/api-docs` using OpenAPI 3.0 specs.
* **Docker**: Includes a multi-stage `Dockerfile` and `docker-compose.yml`.
* **Vercel Serverless File Tracing**: Configured `next.config.js` to bundle SQLite database files for serverless execution.

---

## 📂 Section 2: Pin-to-Pin Feature & Architectural Breakdown

### 1. Database Schema (`prisma/schema.prisma`)
- **`User`**: Stores user credentials, phone, date of birth, avatar URL, 2FA status, and creation timestamps.
- **`ConnectedAccount`**: Stores linked social profiles (`INSTAGRAM`, `FACEBOOK`, `WHATSAPP`), usernames, and avatars.
- **`UserSession`**: Stores active login sessions with device name, device type, OS, browser, IP address, and tokens.
- **`PrivacySetting`**: Stores profile, email, and phone visibility (`EVERYONE`, `FRIENDS`, `ONLY_ME`), personalized ads, and data sharing toggles.
- **`ActivityLog`**: Stores security audit logs (`LOGIN`, `PASSWORD_CHANGE`, `PROFILE_UPDATE`, `ACCOUNT_CONNECTED`, `PRIVACY_UPDATE`, `SESSION_REVOKED`).

---

### 2. Backend REST API Endpoints (`src/app/api/...`)
- `/api/auth/register` (`POST`): Hashes password, creates user & default privacy settings, returns signed JWT.
- `/api/auth/login` (`POST`): Validates credentials against DB or demo user (`demo@redsoftware.in` / `Password123!`), logs activity, issues JWT.
- `/api/auth/logout` (`POST`): Revokes current session and clears HTTP-only cookie.
- `/api/auth/forgot-password` (`POST`): Mock password reset flow.
- `/api/auth/me` (`GET`): Validates JWT token and returns user details and session state.
- `/api/profile` (`GET` / `PUT`): Fetches and updates user profile info (Name, Email, Phone, DOB, Avatar).
- `/api/connected-accounts` (`GET` / `POST` / `DELETE`): Fetches, links new social accounts (Mock OAuth), and disconnects accounts.
- `/api/security/change-password` (`PUT`): Validates current password and sets new password.
- `/api/security/2fa` (`POST`): Toggles 2-Factor Authentication state.
- `/api/privacy` (`GET` / `PUT`): Fetches and updates privacy visibility and ad preferences.
- `/api/activity` (`GET`): Fetches filterable activity history logs.
- `/api/devices` (`GET` / `DELETE`): Lists active sessions and revokes specific or all other device sessions.
- `/api/docs` (`GET`): Returns OpenAPI 3.0 JSON specification.

---

### 3. Frontend Dashboard Pages (`src/app/dashboard/...`)
- **Overview Dashboard** (`/dashboard`): Cards summarizing user info, connected accounts, security status, and active devices.
- **Profile Details** (`/dashboard/profile`): Form for updating personal info and photo avatar URL.
- **Connected Accounts** (`/dashboard/connected-accounts`): List view + Mock OAuth modal for Instagram, Facebook, and WhatsApp.
- **Security Center** (`/dashboard/security`): Password change modal & instant 2FA toggle button.
- **Privacy Settings** (`/dashboard/privacy`): Visibility dropdowns & ad preference toggles.
- **Activity Log** (`/dashboard/activity`): Historical table with dropdown filter by action type.
- **Connected Devices** (`/dashboard/devices`): Active devices list with individual session revocation & "Logout All Other Devices" button.
- **Swagger Documentation** (`/api-docs`): Interactive Swagger UI for testing API endpoints live.

---

## 🎤 Section 3: Expected Interview Questions & Perfect Answers

### **Q1: Why did you choose Next.js 14 (App Router) for this full-stack assignment?**
> **Answer**:  
> *"I chose Next.js 14 App Router because it allows building both the responsive React frontend and backend RESTful APIs inside a single, unified codebase under the `/api` directory. It eliminates CORS complexity, provides server-side rendering benefits, and simplifies deployment to serverless environments like Vercel."*

---

### **Q2: How did you design the Database Architecture?**
> **Answer**:  
> *"I designed a normalized relational database schema using Prisma ORM with 5 core models: `User`, `ConnectedAccount`, `UserSession`, `PrivacySetting`, and `ActivityLog`. I established foreign key relations with `onDelete: Cascade` so that deleting or modifying a user automatically maintains referential integrity across session and privacy records."*

---

### **Q3: How is Authentication & Password Security handled?**
> **Answer**:  
> *"User passwords are hashed using `bcryptjs` with 10 salt rounds before being stored. For authentication, I implemented stateless JWT (JSON Web Tokens) signed with `jose` using HS256 algorithms. The token is stored in an `httpOnly`, `SameSite` secure cookie to prevent Cross-Site Scripting (XSS) attacks."*

---

### **Q4: How does the Mock Social Account Connection (Instagram / Facebook / WhatsApp) work?**
> **Answer**:  
> *"Since real 3rd-party OAuth requires app verification and client secrets, I built a realistic Mock OAuth flow. Users select a platform (Instagram, Facebook, or WhatsApp) and enter their handle in a modal. The API validates duplicate connections, creates a `ConnectedAccount` record, and logs an `ACCOUNT_CONNECTED` audit event in the activity history."*

---

### **Q5: How did you solve the SQLite serverless filesystem issue on Vercel?**
> **Answer**:  
> *"Vercel runs API routes in read-only serverless lambda containers. To prevent SQLite write errors:  
> 1. Configured `experimental.outputFileTracingIncludes` in `next.config.js` to trace `prisma/dev.db` into the deployment bundle.  
> 2. In `src/lib/prisma.ts`, the app dynamically copies `dev.db` to Vercel's writable `/tmp/dev.db` path on lambda initialization.  
> 3. Enriched the JWT payload with user identity so authentication remains 100% stateless across serverless functions."*

---

### **Q6: How does Device Session Management & Remote Logout work?**
> **Answer**:  
> *"When a user logs in, `parseDeviceInfo` parses the request `user-agent` header to detect the OS (Windows/macOS/iOS/Android), Browser (Chrome/Safari/Firefox), Device Type (Desktop/Mobile), and IP address. Sessions are saved in `UserSession`. When a user clicks 'Revoke Session' or 'Logout All Other Devices', the API executes a Prisma `deleteMany` query targeting all session tokens except the active session."*

---

### **Q7: What Bonus Features did you implement to stand out?**
> **Answer**:  
> *"I implemented several key bonus features:  
> - **Dark Mode**: Persistent dark/light theme switching using CSS variables & Tailwind `dark:` classes.  
> - **Interactive Swagger Docs**: Built OpenAPI 3.0 specification served via `swagger-ui-react` at `/api-docs`.  
> - **Docker Support**: Included a multi-stage `Dockerfile` and `docker-compose.yml`.  
> - **Seeded Demo Account**: Pre-seeded `demo@redsoftware.in` / `Password123!` for instant testing."*

---

## 🔑 Demo Credentials for Testing
- **Email**: `demo@redsoftware.in`
- **Password**: `Password123!`
