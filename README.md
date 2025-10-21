# Nestifined MS Framework

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">A production-ready template for building robust NestJS microservices with enterprise-grade features.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/nestifined-ms-framework" target="_blank"><img src="https://img.shields.io/npm/v/nestifined-ms-framework.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/nestifined-ms-framework" target="_blank"><img src="https://img.shields.io/npm/l/nestifined-ms-framework.svg" alt="Package License" /></a>
  <a href="https://github.com/MRdevX/nestifined-ms-framework" target="_blank"><img src="https://img.shields.io/github/stars/MRdevX/nestifined-ms-framework" alt="GitHub Stars" /></a>
  <a href="https://github.com/MRdevX/nestifined-ms-framework" target="_blank"><img src="https://img.shields.io/github/forks/MRdevX/nestifined-ms-framework" alt="GitHub Forks" /></a>
</p>

## 🚀 Quick Start

This template provides a solid foundation for building NestJS microservices. Clone, customize, and deploy!

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start:dev

# Build for production
pnpm build
```

## ✨ Features

This template includes everything you need to build production-ready microservices:

- **🏗️ Architecture**: Modular NestJS microservices with clean separation of concerns
- **🗄️ Database**: TypeORM integration with PostgreSQL support
- **🔐 Authentication**: JWT-based authentication with Passport strategies
- **📚 API Docs**: Swagger/OpenAPI documentation
- **💾 Caching**: Redis integration for performance optimization
- **📨 Messaging**: RabbitMQ support for service-to-service communication
- **🐳 Containerization**: Docker and Kubernetes deployment ready
- **🧪 Testing**: Jest-based testing with fixtures and mocks
- **🔧 Development**: Biome for linting, Husky for Git hooks, conventional commits

## 📁 Project Structure

This template follows a clean, scalable architecture that you can easily extend:

```
src/
├── app/
│   ├── auth/          # Authentication & authorization
│   ├── author/        # Author domain module (example)
│   ├── book/          # Book domain module (example)
│   ├── config/        # Configuration management
│   ├── core/          # Core infrastructure
│   │   ├── cache/     # Redis caching
│   │   ├── database/  # TypeORM setup
│   │   └── messaging/ # RabbitMQ messaging
│   └── users/         # User management
├── logger.ts          # Winston logging setup
└── main.ts           # Application entry point
```

## 🛠️ Available Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `pnpm start`     | Start production server                  |
| `pnpm start:dev` | Start development server with hot reload |
| `pnpm build`     | Build the application                    |
| `pnpm test`      | Run unit tests                           |
| `pnpm test:e2e`  | Run end-to-end tests                     |
| `pnpm lint`      | Lint code with Biome                     |
| `pnpm lint:fix`  | Fix linting issues                       |
| `pnpm format`    | Format code with Biome                   |

## 🌍 Environment Configuration

Create a `.env` file in the root directory:

```bash
# Application
NODE_ENV=development
APP_NAME=NestifinedMS
HOST=127.0.0.1
PORT=3030
API_PREFIX=api

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=nestifined

# Redis
REDIS_URL=redis://localhost:6379

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=default_queue

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
```

## 🗄️ Database Setup

```bash
# Generate migration
pnpm migration:generate --name=InitialSchema

# Run migrations
pnpm migration:run

# Revert migration
pnpm migration:revert
```


## 🐳 Docker & Kubernetes

### Docker

```bash
# Build image
docker build -t nestifined-ms-framework .

# Run container
docker run -p 3030:3030 --env-file .env nestifined-ms-framework
```

### Kubernetes

```bash
# Deploy to development
kubectl apply -k k8s/development/

# Deploy to staging
kubectl apply -k k8s/staging/

# Deploy to production
kubectl apply -k k8s/production/
```

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## 📚 Documentation

- [API Documentation](./docs/) (when available)

## 🤝 Contributing

We welcome contributions to improve this template!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🚀 Getting Started with Your Microservice

1. **Clone this template**: `git clone https://github.com/MRdevX/nestifined-ms-framework.git your-service-name`
2. **Customize the configuration**: Update environment variables and service-specific settings
3. **Replace example modules**: Remove author/book modules and add your domain-specific modules
4. **Add your business logic**: Implement your service's core functionality
5. **Deploy**: Use the provided Docker and Kubernetes configurations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mahdi Rashidi** - [LinkedIn](https://www.linkedin.com/in/mrdevx/)

---

⭐ **Star this repository if you find it helpful!**
