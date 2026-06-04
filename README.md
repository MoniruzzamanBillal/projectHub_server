# ProjectHub API - Backend Server

RESTful API backend for the ProjectHub project management application. Built with Express.js, TypeScript, and Prisma ORM with PostgreSQL (Neon).

## Live URL

https://project-hub-server.vercel.app

## Features

- **Authentication** — JWT-based login and signup with argon2 password hashing
- **Role-Based Access Control** — Admin, Project Manager, and Team Member roles
- **Project Management** — Full CRUD with member management
- **Task Management** — Full CRUD with assignment, priorities, statuses, and due dates
- **Comments** — Add and delete comments on tasks
- **Activity Logging** — Automatic audit trail for all project and task actions
- **Dashboard Statistics** — Aggregated KPIs, priority distribution, and workload analysis
- **Input Validation** — Zod schemas on all request bodies
- **File Upload** — Cloudinary integration for profile images
- **Error Handling** — Unified global error handler with structured responses

## Tech Stack

| Category | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js 4.19 |
| **Language** | TypeScript |
| **ORM** | Prisma ORM v7 |
| **Database** | PostgreSQL (Neon) |
| **Auth** | JWT (jsonwebtoken) |
| **Password Hashing** | argon2 |
| **Validation** | Zod 3.23 |
| **File Upload** | Cloudinary + multer |
| **Deployment** | Vercel (serverless) |

## Getting Started

### Prerequisites
- Node.js 18+
- Yarn or npm
- PostgreSQL database (or Neon account)

### Installation

```bash
git clone <repository-url>
cd projectHubServer
yarn install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
JWT_ACCESS_SECRET="your-secret-key"
BCRYPT_SALT_ROUNDS=12

# Optional — Cloudinary for file uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Database Setup

```bash
# Apply migrations
npx prisma migrate dev

# Generate Prisma client (runs automatically on postinstall)
npx prisma generate
```

### Development

```bash
yarn dev
```

Server starts at http://localhost:5000.

### Build & Production

```bash
yarn build
yarn start:prod
```

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | abc@d.com | 123456 |
| **Project Manager** | abc@d2.com | 123456 |
| **Team Member** | abc@d3.com | 123456 |

## API Endpoints

Base URL: `https://project-hub-server.vercel.app/api`

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/login` | Sign in with email & password | No |
| POST | `/auth/signup` | Create a new account | No |
| PATCH | `/auth/update-user` | Update own profile | Any |
| PATCH | `/auth/delete-user` | Delete a user | Admin |

### Users

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/user/all-user` | List all users (excludes admins) | Admin |
| GET | `/user/team` | List all users for team selection | Any |
| GET | `/user/logged-user` | Get current user profile | Any |
| PATCH | `/user/:userId/role` | Update user role | Admin |

### Projects

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/projects` | Create a project | Admin, PM |
| GET | `/projects` | List all projects | Any |
| GET | `/projects/:id` | Get project details | Any |
| PATCH | `/projects/:id` | Update project | Admin, PM |
| DELETE | `/projects/:id` | Delete project | Admin |
| POST | `/projects/:id/members` | Add member to project | Admin, PM |
| DELETE | `/projects/:id/members/:memberId` | Remove member | Admin, PM |

### Tasks

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/tasks` | Create a task | Admin, PM |
| GET | `/tasks` | List all tasks | Any |
| GET | `/tasks/my` | Get current user's tasks | Any |
| GET | `/tasks/project/:projectId` | Get tasks by project | Any |
| GET | `/tasks/:id` | Get task details | Any |
| PATCH | `/tasks/:id` | Update task | Any |
| DELETE | `/tasks/:id` | Delete task | Admin, PM |

### Comments

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/comments` | Add comment to task | Any |
| GET | `/comments/task/:taskId` | Get comments for task | Any |
| DELETE | `/comments/:id` | Delete comment | Any |

### Activity Logs

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/activity-logs` | List recent activity | Any |
| GET | `/activity-logs/project/:projectId` | Activity by project | Any |
| GET | `/activity-logs/task/:taskId` | Activity by task | Any |
| GET | `/activity-logs/user/:userId` | Activity by user | Any |
| GET | `/activity-logs/:id` | Get single log entry | Any |

### Dashboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/dashboard` | Dashboard statistics (KPIs, priority distribution, workload) | Any |

## Database Schema

### Models

| Model | Table | Description |
|---|---|---|
| User | `users` | Users with role-based access (Admin, PM, Team Member) |
| Project | `projects` | Projects with status tracking |
| ProjectMember | `project_members` | Many-to-many project-user membership |
| Task | `tasks` | Tasks with assignee, priority, and status |
| Comment | `comments` | Comments on tasks |
| ActivityLog | `activity_logs` | Audit trail for all actions |
| Notification | `notifications` | User notifications |

### Enums

| Enum | Values |
|---|---|
| Role | `ADMIN`, `PROJECT_MANAGER`, `TEAM_MEMBER` |
| ProjectStatus | `ACTIVE`, `COMPLETED`, `ON_HOLD` |
| TaskStatus | `TODO`, `IN_PROGRESS`, `COMPLETED` |
| TaskPriority | `HIGH`, `MEDIUM`, `LOW` |
| ActivityAction | `PROJECT_CREATED`, `TASK_UPDATED`, `MEMBER_ADDED`, `COMMENT_ADDED`, etc. |

## Project Structure

```
src/
├── server.ts                     # Entry point
├── app.ts                        # Express app setup (middleware, routes, error handler)
├── app/
│   ├── config/                   # Environment configuration
│   ├── router/                   # Route aggregator
│   ├── interface/                # TypeScript type definitions
│   ├── Error/                    # Custom error classes and handlers
│   ├── middleware/               # Auth, validation, error handler middleware
│   ├── builder/                  # Query builder utilities
│   ├── util/                     # Prisma client, sendResponse, catchAsync, etc.
│   └── modules/                  # Feature modules
│       ├── auth/                 # Authentication (login, signup, profile)
│       ├── user/                 # User management
│       ├── project/              # Project CRUD + members
│       ├── task/                 # Task CRUD
│       ├── comment/              # Task comments
│       ├── activityLog/          # Activity audit log
│       └── dashboard/            # Dashboard statistics
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
└── prisma.config.ts              # Prisma ORM v7 configuration
```

## Deployment

### Deploy to Vercel

1. Push your repository to GitHub
2. Connect the repository to Vercel
3. Set environment variables in Vercel dashboard (`DATABASE_URL`, `JWT_ACCESS_SECRET`)
4. The included `vercel.json` handles build and routing configuration

### Manual Build

```bash
yarn build
node ./dist/server.js
```

## GitHub Repository

https://github.com/<your-username>/projectHubServer
