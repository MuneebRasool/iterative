1. Download Docker
2. Copy this docker compose file at the root level of your directories.

For example, you should have a IterativeCode directory with the frontend (IterativeNext), backend (Iterative) and Backend-Modules (IterativeConverter) repositories in there as folders. This docker-compose.yml file should be at the same level as those folders.

```
version: "3.8"
services:
  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=db
      - POSTGRES_USER=postgres
      - PGUSER=postgres
      - POSTGRES_PASSWORD=postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready", "-d", "db_prod"]
      interval: 30s
      timeout: 60s
      retries: 5
      start_period: 80s  
    networks:
      - iterative
  
  converter:
    image: iterative/converter
    container_name: converter
    build: 
      context: ./iterativeconverter
    ports: 
      - 3001:3001
    networks: 
      - iterative

  flask-api:
    image: iterative/flask-api
    container_name: flask-api
    build:
      context: ./Iterative
    ports:
      - 8000:8000
    volumes:
      - ./iterative/:/usr/src/app
    environment:
      - FLASK_DEBUG=1
      - FLASK_ENV=development
      - FLASK_RUN_PORT=8000
      - DATABASE_URL=postgresql://postgres:postgres@db:5432
      - APP_SETTINGS=config.DevelopmentConfig
      - OPENAI_API_KEY=
      - STYTCH_PROJECT_ENV=test
      - STYTCH_PROJECT_ID=project-test-5981764b-bbf0-47f0-80d3-cae8de7c258c
      - NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=public-token-test-14b26229-48ce-4a71-ba1c-3531f21ea5fa
      - STYTCH_SECRET=secret-test-NddFy9yYTlTli5w6_2TYUDSzQ3ScUiagPRQ=
    depends_on:
      db:
        condition: service_healthy    
    links: 
      - db
    command: >
      sh -c "python3 create_db.py &&
             flask run --debug --host=0.0.0.0 --port=8000"
    networks:
      - iterative
networks:
  iterative:
    name: iterative
```
