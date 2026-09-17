# Omega Beauty World

Omega Beauty World is a luxury beauty e-commerce web application built to showcase a premium storefront, product catalog, cart, checkout flow, and secure admin management. The project is designed with a cloud-native deployment mindset and is structured for deployment on an EC2 instance using Kubernetes, with PostgreSQL as the persistent data layer.

This project was created to demonstrate practical cloud engineering skills such as containerization, environment configuration, database integration, and scalable deployment architecture for a production-like application.

## Project goals

- Build a polished customer-facing beauty storefront
- Provide an admin dashboard for product and store operations
- Prepare the application for cloud deployment on AWS infrastructure
- Demonstrate modern full-stack architecture with separation of concerns
- Show readiness for containerized deployment in Kubernetes environments

## Architecture overview

The application follows a simple, modular full-stack architecture:

- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript
- Data access: repository/service/controller pattern
- Database: PostgreSQL (target production database)
- Deployment target: EC2 + Kubernetes + Docker

### High-level flow

Customer storefront -> React frontend -> Express API -> PostgreSQL database
                                      \-> Admin dashboard for management actions

## Features

- Premium landing page and beauty-brand styling
- Catalog browsing and category-based filtering
- Product detail pages
- Cart and checkout flow
- User login and registration views
- Admin login area and dashboard
- Product data prepared for future backend persistence and automation
- Container and Kubernetes deployment structure

## Tech stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Lucide icons

### Backend
- Node.js
- Express
- TypeScript
- JWT-based auth flow
- Repository/service layer design
- PostgreSQL-ready data access

### DevOps / deployment
- Docker
- Docker Compose
- Kubernetes manifests
- AWS RDS PostgreSQL readiness
- EC2 deployment strategy

## Project structure

```text
project/
├── backend/
│   ├── src/
│   ├── schema.sql
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── kubernetes/
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── secret.yaml
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Local development

### Prerequisites

- Node.js 20+
- npm
- Git
- Optional: Docker Desktop for local PostgreSQL container testing

### Backend setup

```bash
cd backend
npm install
npm run dev
```

The backend serves on:

```text
http://localhost:4000
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

The storefront runs on:

```text
http://localhost:5173
```

### Environment variables

The backend uses environment variables for runtime configuration. Example values are defined in the file [backend/.env.example](backend/.env.example).

Example backend environment:

```env
PORT=4000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-dev-secret
JWT_EXPIRES_IN=7d
DATABASE_URL=postgres://postgres:postgres@localhost:5432/omegabeauty
```

For production, set the values securely and avoid committing real secrets to GitHub.

## Database

The project is structured for PostgreSQL and includes a schema file at [backend/schema.sql](backend/schema.sql). The backend repository layer uses a database URL based on the environment variable `DATABASE_URL`.

### Recommended production database
- AWS RDS PostgreSQL

This is the preferred cloud database for the project because it matches a realistic cloud-native deployment story and is highly relevant for cloud jobs and portfolio presentations.

## Docker and Kubernetes

The project includes basic Docker and Kubernetes configuration for future deployment.

### Docker files
- [backend/Dockerfile](backend/Dockerfile)
- [frontend/Dockerfile](frontend/Dockerfile)
- [frontend/nginx.conf](frontend/nginx.conf)

### Kubernetes manifests
- [kubernetes/backend-deployment.yaml](kubernetes/backend-deployment.yaml)
- [kubernetes/frontend-deployment.yaml](kubernetes/frontend-deployment.yaml)
- [kubernetes/secret.yaml](kubernetes/secret.yaml)

### Deployment target

The intended deployment architecture is:

- EC2 instance running a Kubernetes distribution such as k3s
- Backend deployment using a containerized Express API
- Frontend deployment using a containerized React app served by NGINX
- PostgreSQL database hosted on AWS RDS
- Secrets managed through Kubernetes secrets or secure environment variables

## Admin access

The project includes a separate admin/login flow intended to be distinct from the customer storefront. This separation is useful because admin features require different access controls and responsibilities from the public customer experience.

Example admin demo credentials are intentionally simple for local testing and demonstration use:

- Email: admin@omegabeauty.com
- Password: admin123

For production, replace this with a real secure authentication model and role-based access control.

## Verification

The project has been verified locally with the following checks:

```bash
cd backend
npm test
npm run build
```

and:

```bash
cd frontend
npm run build
```

These checks completed successfully during validation.

## Deployment roadmap

1. Provision AWS RDS PostgreSQL
2. Configure `DATABASE_URL` and runtime environment variables
3. Build and push Docker images to Docker Hub
4. Provision EC2 and install Kubernetes runtime
5. Deploy backend and frontend to Kubernetes
6. Add ingress, TLS, and observability
7. Validate health checks and production flows

## Notes for job portfolio use

This project is suitable for showcasing:

- full-stack application design
- containerization
- environment-based configuration
- cloud architecture thinking
- database integration planning
- Kubernetes deployment readiness
- modern frontend and backend separation

It demonstrates a strong cloud engineering story that can be discussed in interviews for DevOps, platform, and cloud-focused roles.

## Future enhancements

- Real PostgreSQL repository implementations for all domains
- Role-based admin access
- CI/CD pipeline with GitHub Actions
- Secure Kubernetes secrets management
- Ingress and TLS termination
- Monitoring and log aggregation
- Automated testing and deployment validation

## License

This project is intended for portfolio and professional demonstration use in cloud and software engineering contexts.
