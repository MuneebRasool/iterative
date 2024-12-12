# Iterative: AI-Powered React Code Generator and Iterative Deployment Platform

## Overview
Iterative is an advanced AI-powered platform that simplifies frontend development. It dynamically generates React code using OpenAI's API, provides actionable recommendations for project improvement, manages project states for A/B testing, and enables secure deployment. Iterative includes full database migration support using Alembic and Flask-Migrate.

## Features
1. **React Code Generation**: Generates functional React components with inline styling based on user input.
2. **AI Recommendations**: Offers tailored suggestions to enhance your project.
3. **Version Control**: Enables reverting to previous project states and conducting A/B tests.
4. **Secure Deployment**: Deploy and manage project states with password-protected access.
5. **Real-Time Collaboration**: Leverage Socket.IO for live code updates and feedback.
6. **Authentication**: Stytch-powered secure user authentication.

**🚀 Demo Screencast:** [Watch the demo on YouTube](https://youtu.be/WD9ythRbt8Q?si=paMO-YUa9gYWwaSQ)


## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/)
- OpenAI API Key
- Stytch API credentials

### Step 1: Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=
OPENAI_API_KEY=
OPENAI_ORG_ID=
OPENAI_MODEL=gpt-3.5-turbo          # Default: gpt-3.5-turbo
STYTCH_PROJECT_ID=
STYTCH_SECRET=
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=
STYTCH_PROJECT_ENV=test
ITERATIVE_ENV=dev

# Application Settings
NEXT_PUBLIC_API_BASE_URL=           # Default: http://localhost:8000
NEXT_PUBLIC_CONVERTER_BASE_URL=     # Default: http://localhost:3001
```

Secret keys can be generated on the fly with `openssl rand -base64 32`.

Place a copy in the frontend build directory:

```bash
ln .env frontend/.env.local # Must not be a symlink
```

___

### Step 2: Build database

> [!Important]
> Postgres database is required, and credentials should be in the previously mentioned env. See the Postgres Docker image for help setting up a container.

```bash
docker compose run --rm --build iterative_backend bash -c "flask db init && flask db migrate && flask db upgrade"
```

___

### Step 3: Backend Modules Configuration

Create a `.env` file in the `backend-modules/` folder with the following:

```env
BACKEND_HOST=http://localhost:8000
```

___

### Step 4: Run the Application

```bash
docker-compose up -d --build
```

Access the applications:
- Backend: [http://localhost:8000](http://localhost:8000)
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend Modules: [http://localhost:8080](http://localhost:8080)

---

### Troubleshooting

- **Database Errors**: Ensure your `DATABASE_URL` in `.env` is correct and the database server is running.
- **Port Conflicts**: Make sure no other applications are running on ports 8000, 3000, or 8080.

--------

## React Code Generation
Send a POST request to `/api/generate` with project details to generate React code.

## Recommendations
Use `/api/recommendations` to get suggestions for improving your project.

## Project Management
Create, update, delete, and fetch projects using the `/api/projects` endpoints.

## Version Control
Manage project states via `/api/projects/project_state`.

## Deployments
Deploy project states securely through `/api/deployments`.

## User Settings
Customize settings for AI models, CSS frameworks, and color schemes via `/api/update-user-settings`.

## Database Management
Apply migrations and manage schema changes seamlessly using Alembic.

## Health Monitoring
Use `/api/health` for system health checks.

## Directory Structure
- **`app/`**: Core application logic, organized by blueprints.
  - **`projects/`**: Manage projects and states.
  - **`deployments/`**: Handle deployment and A/B testing.
  - **`settings/`**: Manage user-specific configurations.
  - **`chat/`**: Real-time interactions and AI-driven recommendations.
  - **`openai/`**: OpenAI API integration and prompt handling.
- **`migrations/`**: Database migration files generated with Alembic.
  - **`versions/`**: Contains migration scripts for schema changes.
- **`config.py`**: Configuration for development and production.
- **`tasks.py`**: Celery tasks for handling asynchronous processes.
- **`requirements.txt`**: Python dependencies.
- **`Dockerfile`**: Docker container setup.
- **`compose-dev.yaml`**: Docker Compose configuration for development.

## Dependencies
Key Python dependencies:
- Flask (`Flask`, `Flask-SQLAlchemy`, `Flask-Migrate`, `Flask-SocketIO`)
- OpenAI API (`openai`)
- Stytch Authentication (`stytch`)
- Alembic for database migrations
- Asynchronous Task Management (`celery`, `redis`)

## Running Tests
Run the test suite:
```bash
pytest
```

## Frontend Application Setup

In addition to the backend services, Iterative includes a frontend application built with Next.js. This frontend provides an intuitive user interface for interacting with the platform's features.

### Setting Up the Frontend

1. Navigate to the frontend application directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following content:
   ```env
   STYTCH_PROJECT_ENV=test
   STYTCH_PROJECT_ID="project-test-5981764b-bbf0-47f0-80d3-cae8de7c258c"
   NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN="public-token-test-14b26229-48ce-4a71-ba1c-3531f21ea5fa"
   STYTCH_SECRET="secret-test-NddFy9yYTlTli5w6_2TYUDSzQ3ScUiagPRQ="
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Access the frontend application at:
   ```plaintext
   http://localhost:3000
   ```

---

## Additional Docker Deployment Options

From the **iterativeconverter-main** repository, additional Docker deployment options are available for varying CPU architectures:

1. Build and deploy the backend with Docker:
   ```bash
   docker build -t iterative-backend .
   ```

2. For CPU-specific builds:
   ```bash
   docker buildx build --platform linux/amd64 -t iterative-backend .
   ```

3. To deploy locally using Docker Compose:
   ```bash
   docker compose up --build
   ```

---

## Contributing
We welcome contributions! Please see `CONTRIBUTING.md` for guidelines.

## License
This project is licensed under the MIT License. See `LICENSE` for details.

## Acknowledgments
Thanks to OpenAI for powering React code generation and the open-source community for their contributions. Also special thanks to [Kai Mou](https://github.com/kaimou1357) for building out a huge part of Iterative!!
