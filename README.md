# The Not Project — API

**API Endpoint:** [api.thenotproject.com](https://api.thenotproject.com)

This repository contains the source code for the backend API powering The Not Project. It handles the core business logic, story management, media processing, and data persistence for the platform. It is designed as a robust RESTful service to support both the public-facing website and the internal admin dashboard.

---

## ✍️ Founders

- **Lorenzo Gonzalez** — Creator of the concept and lead content producer
- **Tariq El Ghayate** — Lead developer of the platform
- **Sebastian Torres** — Creative Producer & Co-Developer

---

## 🛠️ Tech Stack

- **Runtime & Framework:** Node.js, Express, TypeScript
- **Database & ORM:** MYSQL (AWS RDS), Prisma ORM
- **Media & Storage:** AWS S3 (Storage), Cloudfront (CDN). Sharp (Image Processing)
- **Communication:** Resend (Email/Contact form)
- **Deployment:** AWS EC2 (Manual deployment)

---

## 🚀 Setup

The API is hosted on a private EC2 instance and interacts with a protected RDS instance. Access is restricted for security.

### Prerequisites

Before starting, make sure you have the following installed:

- Git & Node.js ^20.9x (LTS recommended)
- **IAM Database Access:** Verify that Tariq has granted your AWS user the necessary permissions.
- **SSH Access:** Required for interacting with the EC2 environment. 

### 1. Clone the repository

```bash
git clone https://github.com/The-Not-Project/not-project-api
cd not-project-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Copy the example environment file. This includes configurations for AWS S3, Cloudfront, Resend, and the RDS Connection String.

```bash
cp .env.example .env.local
```

> [!IMPORTANT]
> **Refer to Tariq** to obtain the current values for `.env.local`. This includes the `API_ACCESS_KEY` required by the auth middleware to validate requests.

### 4. Database & Development

Generate the Prisma client before starting the server:

```bash
npx prisma generate
npm run dev
```

### 5. Build & Production
To prepare the project for production deployment on the EC2 instance:

```bash
npm run build
npm start
```
---

## 📁 Folder Structure

```bash
prisma/
└── schema.prisma                # Database schema and models

src/
├── controllers/                 # Request handlers
│   ├── category/                # Category management
│   ├── contact/                 # Contact form logic via Resend
│   ├── story/                   # Story, Radar, and Recommendation logic
│   │   └── helpers/             # Sharp image compression & S3 upload logic
│   └── user/                    # User data management
├── middleware/
│   └── auth.ts                  # API Secret header validation
├── prisma/
│   ├── index.ts                 # Prisma Client instantiation
│   └── testConnection.ts        # Database connectivity check
├── routes/
│   ├── router.ts                # Main router entry point
│   └── [feature].routes.ts      # Feature-specific route definitions
├── server/
│   ├── index.ts                 # Express app configuration
│   └── start.ts                 # Server entry point
└── types/                       # TypeScript interfaces/types
```

## 🌐 Deployment

- **Environment:** The API runs on a self-managed AWS EC2 instance.
- **Process:** Deployment is handled manually. Verify that all Prisma migrations and environment variables are synced before restarting the production process.