# 🛼 Los Inmaduros Backend

![Tests](https://img.shields.io/badge/tests-28%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-40%25-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Node](https://img.shields.io/badge/Node-20%2B-green)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

Professional REST API for the roller skating community **Los Inmaduros Rollers Madrid**. Complete backend with authentication, route management, meetups, reviews, and photo gallery.

## 🚀 Key Features

- ✅ **Secure authentication** with Clerk
- ✅ **Route system** with difficulty levels
- ✅ **Meetups (Route Calls)** with meeting points
- ✅ **Attendance system** for meetups
- ✅ **Reviews and ratings** for routes
- ✅ **Personalized favorites** per user
- ✅ **Photo gallery** with moderation and Supabase Storage
- ✅ **Pagination** on all list endpoints
- ✅ **Rate limiting** for attack protection
- ✅ **Strict validation** with Zod
- ✅ **Complete interactive Swagger documentation**
- ✅ **Docker support** for easy deployment

---

## 🛠️ Tech Stack

- **Node.js** + **TypeScript** - Runtime and language
- **Express.js** - Web framework
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **Docker** + **Docker Compose** - Containerization
- **Clerk** - Authentication and user management
- **Supabase Storage** - Image storage
- **Zod** - Schema validation
- **Swagger/OpenAPI** - API documentation
- **Express Rate Limit** - Attack protection
- **Jest** + **Supertest** - Testing framework

---

## 📦 Installation

### Prerequisites

- **Docker & Docker Compose** (Recommended) - [Install Docker Desktop](https://www.docker.com/products/docker-desktop)

**OR**

- Node.js 20+ or higher
- PostgreSQL 14 or higher
- Clerk account (https://clerk.com)
- Supabase account (https://supabase.com)

---

### 🐳 Quick Start with Docker (Recommended)

The easiest way to run the project is with Docker. Everything is configured automatically.

**1. Clone the repository**

```bash
git clone https://github.com/Adriasu09/los-inmaduros-backend.git
cd los-inmaduros-backend
```

**2. Create `.env` file**

Copy `.env.example` to `.env` and fill in your Clerk and Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

**3. Start with Docker Compose**

```bash
npm run docker:dev
```

Or directly:

```bash
docker-compose up --build
```

**That's it!** 🚀

- Backend: http://localhost:4000
- API Docs: http://localhost:4000/api-docs
- PostgreSQL: localhost:5432

**Docker automatically:**

- ✅ Sets up PostgreSQL database
- ✅ Runs Prisma migrations
- ✅ Installs dependencies
- ✅ Starts the server with hot reload

**Useful Docker commands:**

```bash
# Stop containers
npm run docker:dev:down

# View logs
npm run docker:logs

# Rebuild from scratch
docker-compose down -v && docker-compose up --build

# Stop and remove everything
docker-compose down -v
```

---

### 💻 Manual Installation (Without Docker)

If you prefer to run without Docker:

**1. Clone the repository**

```bash
git clone https://github.com/Adriasu09/los-inmaduros-backend.git
cd los-inmaduros-backend
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the root directory:

```env
# Server
PORT=4000
NODE_ENV=development

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/los_inmaduros

# Supabase Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

**4. Run Prisma migrations**

```bash
npx prisma migrate dev
```

**5. Start development server**

```bash
npm run dev
```

Server will be running at `http://localhost:4000` 🚀

---

## 📚 API Documentation

Complete interactive documentation is available at **Swagger UI**:

👉 **http://localhost:4000/api-docs**

### Main Endpoints

| Method | Endpoint                           | Description                | Auth |
| ------ | ---------------------------------- | -------------------------- | ---- |
| `GET`  | `/api/routes`                      | List all routes            | No   |
| `GET`  | `/api/routes/:slug`                | Route details with reviews | No   |
| `POST` | `/api/routes/:routeId/reviews`     | Create review              | Yes  |
| `GET`  | `/api/route-calls`                 | List meetups (paginated)   | No   |
| `POST` | `/api/route-calls`                 | Create meetup              | Yes  |
| `POST` | `/api/route-calls/:id/attendances` | Confirm attendance         | Yes  |
| `GET`  | `/api/photos`                      | List photos (paginated)    | No   |
| `POST` | `/api/photos`                      | Upload photo               | Yes  |
| `GET`  | `/api/favorites`                   | My favorite routes         | Yes  |
| `POST` | `/api/routes/:routeId/favorites`   | Add to favorites           | Yes  |

---

## 🔒 Security

### Security Implementations

✅ **Rate Limiting**

- General: 100 requests/15 min per IP
- Authentication: 5 requests/15 min per IP
- Resource creation: 20 requests/15 min per IP

✅ **CORS Configuration**

- Only accepts requests from specific frontend
- Credentials enabled securely

✅ **Strict Validation**

- All inputs validated with Zod
- UUIDs verified
- Future dates required for meetups
- Google Maps URLs verified

✅ **Secure File Upload**

- Filename sanitization (prevents path traversal)
- MIME type vs extension validation
- 5MB limit per image
- Only allowed formats: JPEG, PNG, GIF, WebP

✅ **Data Protection**

- Detailed errors only in development
- Stack traces hidden in production
- Required environment variables

---

## 🧪 Testing

The project includes comprehensive unit tests with **40% coverage**:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit
```

### Test Coverage

- **28 passing tests**
- **Route calls validation**: 95% coverage
- **Reviews validation**: 100% coverage
- **Photos validation**: 73% coverage
- **Upload middleware**: Path traversal & injection prevention

---

## 🗄️ Project Structure

```
los-inmaduros-backend/
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Prisma schema
├── src/
│   ├── __tests__/           # Test files
│   │   ├── unit/            # Unit tests
│   │   ├── integration/     # Integration tests
│   │   └── helpers/         # Test utilities
│   ├── config/              # Configuration (env, swagger, supabase)
│   ├── database/            # Prisma client
│   ├── modules/             # Application modules
│   │   ├── routes/          # Predefined routes
│   │   ├── route-calls/     # Meetups
│   │   ├── reviews/         # Reviews
│   │   ├── favorites/       # Favorites
│   │   ├── attendances/     # Attendance
│   │   ├── photos/          # Photos and gallery
│   │   ├── auth/            # Authentication
│   │   └── config/          # Global config
│   ├── shared/              # Shared code
│   │   ├── middlewares/     # Rate limiting, validation, auth
│   │   ├── services/        # Storage, user sync
│   │   ├── errors/          # Custom errors
│   │   └── constants/       # Constants
│   └── app.ts               # Entry point
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose for development
├── docker-compose.prod.yml  # Docker Compose for production
├── .dockerignore            # Docker ignore file
├── .env.example             # Environment variables example
├── jest.config.js           # Jest configuration
├── package.json
└── README.md
```

---

## 🎯 Pagination

All list endpoints support pagination:

### Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

### Example

```bash
GET /api/route-calls?page=2&limit=10
```

### Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "totalCount": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

---

## 🧰 Available Scripts

```bash
# Development with hot reload
npm run dev

# Compile TypeScript
npm run build

# Run in production
npm start

# Run tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Docker commands
npm run docker:dev         # Start with Docker
npm run docker:dev:down    # Stop Docker containers
npm run docker:logs        # View Docker logs
npm run docker:prod        # Production mode

# Prisma commands
npx prisma migrate dev     # Run migrations
npx prisma studio          # Open Prisma Studio
npx prisma generate        # Generate Prisma client
```

---

## 🌐 Deployment

### Production Environment Variables

Make sure to configure these variables in your hosting service (Render, Railway, etc.):

```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
DATABASE_URL=your_postgresql_production_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Recommendations

- **Backend**: Render.com (free tier) - Docker supported
- **Database**: Render PostgreSQL or Supabase
- **Storage**: Supabase Storage

### Deploy with Docker

This project includes Docker support for easy deployment to any platform that supports containers (Render, Railway, Fly.io, etc.).

---

## 👤 Author

**Adriana Suárez** - Frontend Developer  
[GitHub](https://github.com/Adriasu09) | [LinkedIn](https://www.linkedin.com/in/adriana-suárez-4562a5249)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

---

**Made with ❤️ for the Los Inmaduros Rollers Madrid skating community 🛼**
