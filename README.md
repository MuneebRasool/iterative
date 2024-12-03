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
- Python 3.8+
- Git
- OpenAI API Key
- Stytch API credentials

### Installation
1. Step 1: Clone the repository:
   ```bash
   git clone https://github.com/your-username/iterative.git
   cd iterative

## Configure Environment Variables
2. Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-api-key
STYTCH_PROJECT_ID=your-stytch-project-id
STYTCH_SECRET=your-stytch-secret
STYTCH_PROJECT_ENV=test
```
#### Generate a Secret Key

You can generate a secret key for your `.env` file using the following Python command:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## Build and Run the Application
To build and run the application, use the following command:

```bash
docker-compose -f compose-dev.yaml up --build
```

## Run Database Migrations
Run the database migrations with the command:

```bash
flask db upgrade
```

---

### Step 2: Set Up Environment Variables

Set up `.env` files for the backend, frontend, and backend modules:

#### Backend

Create a `.env` file in the `backend/` folder with the following:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-api-key
```

#### Frontend

Create a `.env.local` file in the `frontend/` folder with the following:

```env
STYTCH_PROJECT_ENV=test
STYTCH_PROJECT_ID=your-stytch-project-id
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=your-stytch-public-token
STYTCH_SECRET=your-stytch-secret
```

#### Backend Modules

Create a `.env` file in the `backend-modules/` folder with the following:

```env
BACKEND_HOST=http://localhost:8000
```

---

### Step 3: Install Dependencies

#### Backend

Navigate to the `backend/` folder:

```bash
cd backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

#### Frontend

Navigate to the `frontend/` folder:

```bash
cd frontend
```

Install Node.js dependencies:

```bash
npm install
```

#### Backend Modules

Navigate to the `backend-modules/` folder:

```bash
cd backend-modules
```

Install Node.js dependencies:

```bash
npm install
```

---

### Step 4: Run the Application

#### Using Docker Compose

From the root of the repository, run:

```bash
docker-compose up --build
```

Access the applications:
- Backend: [http://localhost:8000](http://localhost:8000)
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend Modules: [http://localhost:8080](http://localhost:8080)

#### Without Docker (Manual Start)

**Start the Backend:**

```bash
cd backend
flask db upgrade
flask run
```

**Start the Frontend:**

```bash
cd frontend
npm run dev
```

**Start the Backend Modules:**

```bash
cd backend-modules
node server.js
```

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

Install dependencies locally (if not using Docker):
```bash
pip install -r requirements.txt
```

## Running Tests
Run the test suite:
```bash
pytest
```

## Deployment
Build the Docker image:
```bash
docker build -t iterative .
```

Deploy on platforms like AWS, Heroku, or any Docker-compatible environment.

Configure production-specific environment variables in `.env`.

## Database Migration Workflow
Create a migration script:
```bash
flask db migrate -m "Your migration message"
```

Apply migrations:
```bash
flask db upgrade
```

Rollback migrations if needed:
```bash
flask db downgrade
```

---

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
