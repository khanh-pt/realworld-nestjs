# RealWorld NestJS Implementation

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A production-ready <a href="https://realworld-docs.netlify.app/docs/specs/backend-specs/introduction" target="_blank">RealWorld</a> backend implementation built with <a href="http://nestjs.com/" target="_blank">NestJS</a>, TypeORM, PostgreSQL, and JWT authentication.</p>

<p align="center">
  <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://jwt.io/" target="_blank"><img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT" /></a>
</p>

## 📋 Description

This is a fully-featured backend implementation of the [RealWorld](https://realworld-docs.netlify.app/) specification using modern technologies:

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Argon2 password hashing
- **Documentation**: OpenAPI/Swagger
- **Validation**: Class-validator and class-transformer
- **Internationalization**: nestjs-i18n
- **Testing**: Jest for unit and e2e tests

## 🚀 Features

### Core Functionality

- ✅ **User Authentication & Authorization**

  - User registration and login
  - JWT-based authentication
  - Password hashing with Argon2
  - Optional authentication for public endpoints

- ✅ **Article Management**

  - Create, read, update, delete articles
  - Article favoriting/unfavoriting
  - Article feed for followed users
  - Pagination and filtering

- ✅ **Comment System**

  - Add comments to articles
  - View all comments for an article
  - Delete comments (author only)

- ✅ **User Profiles**

  - View user profiles
  - Follow/unfollow users
  - Update user information

- ✅ **Tag System**
  - Tag management for articles
  - Popular tags endpoint

### Technical Features

- 🔒 **Security**: JWT authentication, password hashing, input validation
- 📚 **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- 🌐 **CORS**: Configured for cross-origin requests
- 🏗️ **Architecture**: Modular design with separation of concerns
- 🔄 **Database Migrations**: TypeORM migrations for schema management
- 🌍 **Internationalization**: Multi-language support
- 🧪 **Testing**: Comprehensive test suite

## 📁 Project Structure

```
src/
├── api/                    # API modules
│   ├── article/           # Article management
│   ├── comment/           # Comment system
│   ├── follow/            # User following
│   ├── jwt/               # JWT configuration
│   ├── profile/           # User profiles
│   ├── tag/               # Tag management
│   └── user/              # User management
├── common/                # Shared DTOs and utilities
├── config/                # Application configuration
├── constants/             # Application constants
├── database/              # Database configuration and migrations
├── decorators/            # Custom decorators
├── filters/               # Exception filters
├── guards/                # Authentication guards
├── i18n/                  # Internationalization files
├── middleware/            # Custom middleware
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── validators/            # Custom validators
```

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- pnpm (recommended) or npm

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/khanhpt-2853/realworld-nestjs.git
cd realworld-nestjs
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=realworld_nestjs

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Application
APP_PORT=3333
APP_ENV=development
```

### 4. Database Setup

```bash
# Run database migrations
pnpm run migration:run
```

### 5. Start the application

```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

The application will start on `http://localhost:3333`

## 📖 API Documentation

Once the application is running, you can access the interactive API documentation at:

- **Swagger UI**: `http://localhost:3333/api`

The API follows the [RealWorld API specification](https://realworld-docs.netlify.app/docs/specs/backend-specs/introduction) and includes the following endpoints:

### Authentication

- `POST /api/users/login` - User login
- `POST /api/users` - User registration

### User & Profile

- `GET /api/user` - Get current user
- `PUT /api/user` - Update user
- `GET /api/profiles/:username` - Get profile
- `POST /api/profiles/:username/follow` - Follow user
- `DELETE /api/profiles/:username/follow` - Unfollow user

### Articles

- `GET /api/articles` - List articles
- `GET /api/articles/feed` - Get user's feed
- `GET /api/articles/:slug` - Get article
- `POST /api/articles` - Create article
- `PUT /api/articles/:slug` - Update article
- `DELETE /api/articles/:slug` - Delete article
- `POST /api/articles/:slug/favorite` - Favorite article
- `DELETE /api/articles/:slug/favorite` - Unfavorite article

### Comments

- `GET /api/articles/:slug/comments` - Get comments
- `POST /api/articles/:slug/comments` - Add comment
- `DELETE /api/articles/:slug/comments/:id` - Delete comment

### Tags

- `GET /api/tags` - Get tags

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# End-to-end tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov

# Watch mode
pnpm run test:watch
```

## 🗄️ Database Operations

### Migrations

```bash
# Generate a new migration
pnpm run migration:generate src/database/migrations/MigrationName

# Create an empty migration
pnpm run migration:create src/database/migrations/MigrationName

# Run migrations
pnpm run migration:run

# Revert last migration
pnpm run migration:revert

# Show migration status
pnpm run migration:show
```

## 🔧 Development Scripts

```bash
# Format code
pnpm run format

# Lint code
pnpm run lint

# Build for production
pnpm run build
```

## 🏗️ Architecture & Design Patterns

### Key Design Patterns

- **Module Pattern**: Each feature is organized as a separate NestJS module
- **Repository Pattern**: Data access through TypeORM repositories
- **DTO Pattern**: Data Transfer Objects for request/response validation
- **Guard Pattern**: Authentication and authorization guards
- **Decorator Pattern**: Custom decorators for common functionality

### Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Argon2 for secure password storage
- **Input Validation**: Class-validator for request validation
- **CORS**: Cross-origin resource sharing configuration
- **Exception Handling**: Global exception filter

## 🔌 Technologies Used

| Technology      | Purpose              | Version |
| --------------- | -------------------- | ------- |
| NestJS          | Backend framework    | ^11.0.1 |
| TypeScript      | Programming language | ^5.7.3  |
| TypeORM         | Database ORM         | ^0.3.25 |
| PostgreSQL      | Database             | ^8.16.3 |
| JWT             | Authentication       | ^11.0.0 |
| Argon2          | Password hashing     | ^0.43.1 |
| Swagger         | API documentation    | ^11.2.0 |
| Jest            | Testing framework    | ^29.7.0 |
| Class-validator | Validation           | ^0.14.2 |
| nestjs-i18n     | Internationalization | ^10.5.1 |

## 🚀 Deployment

### Docker Deployment

```bash
# Build the application
pnpm run build

# Create Docker image
docker build -t realworld-nestjs .

# Run with Docker Compose
docker-compose up -d
```

### Production Checklist

- [ ] Set secure JWT secret
- [ ] Configure production database
- [ ] Set up proper CORS origins
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Configure SSL/TLS

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- [RealWorld](https://realworld-docs.netlify.app/) - For providing the specification
- [NestJS](https://nestjs.com/) - For the amazing framework
- [TypeORM](https://typeorm.io/) - For the excellent ORM

## 📞 Support & Contact

- **Author**: khanhpt-2853
- **Repository**: [realworld-nestjs](https://github.com/khanhpt-2853/realworld-nestjs)
- **Issues**: [GitHub Issues](https://github.com/khanhpt-2853/realworld-nestjs/issues)

---

<p align="center">Made with ❤️ using NestJS</p>
