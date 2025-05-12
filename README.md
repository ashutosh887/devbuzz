# DevBuzz

**Where Developers Build, Share, and Grow.**

## Tech Stack

* **Frontend:** Next.js App Router (15), React 19, TypeScript, TailwindCSS
* **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL (via Neon)
* **Authentication:** Custom OTP login, session cookies, bcrypt
* **UI & Styling:** TailwindCSS, ShadCN UI, Lucide Icons, Radix UI
* **State Management:** Redux Toolkit
* **Email:** Resend + React Email
* **Notifications:** Sonner
* **Database Hosting:** Neon

## Folder Structure

```
├── app/
│   ├── api/                # API routes (posts, auth, session, vote)
│   ├── feed/               # Feed and post detail pages
│   └── layout.tsx          # App shell with theme provider
│
├── components/
│   ├── common/             # Reusable UI components (Navbar, Skeletons)
│   ├── comments/           # Threaded comments (CommentsThread.tsx)
│   └── ui/                 # ShadCN UI components (Button, Input, etc.)
│
├── lib/
│   ├── prisma.ts           # Prisma client
│   └── session.ts          # Cookie/session helpers
│
├── prisma/
│   └── schema.prisma       # Database schema
│
├── public/                 # Static assets
├── styles/                 # Tailwind setup
└── types/                  # Shared TypeScript types
```

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/devbuzz
cd devbuzz
npm install
```

To start the development server:

```bash
npm run dev
# or yarn / pnpm / bun
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Database Setup (PostgreSQL on Neon)

Create a PostgreSQL database using [Neon](https://console.neon.tech) and configure your `.env` file:

```env
DATABASE_URL="postgresql://<your-username>:<your-password>@<your-host>/<your-db>?sslmode=require"
```

Then push the Prisma schema:

```bash
npx prisma db push
npx prisma generate
```

## Authentication Flow

* OTP login system using `/api/auth/send-otp` and `/api/auth/verify-otp`
* OTPs are hashed with bcrypt
* Session cookies are stored in PostgreSQL
* Session protection across pages and APIs

Also set:

```env
JWT_SECRET="<your-jwt-secret>"
```

## Email Integration

* Uses [Resend](https://resend.com) to send OTPs
* Uses `react-email` to render transactional email content

```env
RESEND_API_KEY="<your-resend-api-key>"
```

## Scripts & Tooling

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Build for production
npm run lint       # Lint the code
```

## Features

* OTP authentication with secure session cookies
* Post creation and threaded comment replies
* Voting system (upvote/downvote once per user)
* Inline reply forms with deep nesting
* Toast feedback with Sonner
* Typed APIs and frontend state
* Dark mode support with `next-themes`
* Tailwind + ShadCN UI + Lucide Icons

## References

### Home Page

Feed view with posts and voting

<img width="100%" alt="Home Page" src="https://github.com/user-attachments/assets/628ea01c-6083-4903-8940-aceae3aa59eb" />

### Profile Page

User activity and contribution history

<img width="100%" alt="Profile Page" src="https://github.com/user-attachments/assets/e1c29ee6-a33f-4442-8d48-5351ac89df17" />

### Post Creation

Simple editor with title + content fields

<img width="100%" alt="Post Creation Page" src="https://github.com/user-attachments/assets/9feb6c0a-be2a-462c-b019-19ca903862e5" />

### Post Detail

Shows comments and replies with voting

<img width="100%" alt="Post Page" src="https://github.com/user-attachments/assets/e0bdbfb6-2bb8-4922-bfa1-2f1845f158f1" />

### Auth Page

Enter email to receive OTP

<img width="100%" alt="Auth Page" src="https://github.com/user-attachments/assets/b2b93178-73df-4267-b396-8cd5e67b2597" />

### OTP Verification

Enter your one-time passcode to log in

<img width="100%" alt="OTP Auth Page" src="https://github.com/user-attachments/assets/7577c18c-518b-4d9b-91c3-5ea3d836eb94" />


