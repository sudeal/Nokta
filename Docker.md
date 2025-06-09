# Docker Setup for Nokta API

This document explains how to run the Nokta API using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed on your machine
- Docker Compose (included with Docker Desktop)

## Files Added

- `Dockerfile` - Multi-stage Docker build for the .NET API
- `docker-compose.yml` - Orchestrates API and SQL Server services
- `.dockerignore` - Excludes unnecessary files from Docker build
- `appsettings.Docker.json` - Docker-specific configuration

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the API:**
   - API: http://localhost:5000
   - Swagger UI: http://localhost:5000/swagger

3. **Stop services:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker only

1. **Build the API image:**
   ```bash
   docker build -t nokta-api .
   ```

2. **Run the API container:**
   ```bash
   docker run -p 5000:8080 -e ASPNETCORE_ENVIRONMENT=Development nokta-api
   ```

## Services

### API Service
- **Container Name:** nokta-api
- **Port:** 5000 (host) → 8080 (container)
- **Environment:** Docker
- **Image:** Built from local Dockerfile

### SQL Server Service
- **Container Name:** nokta-sqlserver
- **Port:** 1433 (host) → 1433 (container)
- **Image:** mcr.microsoft.com/mssql/server:2022-latest
- **SA Password:** YourStrong@Passw0rd
- **Database:** nokta-db

## Database Migration

When running for the first time, you may need to run Entity Framework migrations:

```bash
# Connect to the running API container
docker exec -it nokta-api bash

# Run migrations inside the container
dotnet ef database update
```

Alternatively, you can run migrations from your host machine if you have the .NET SDK installed:

```bash
# Update connection string to point to localhost:1433
dotnet ef database update
```

## Environment Variables

The Docker setup uses these key environment variables:

- `ASPNETCORE_ENVIRONMENT=Docker`
- `ASPNETCORE_URLS=http://+:8080`
- `ConnectionStrings__DefaultConnection` - Points to the containerized SQL Server

## Volumes

- `sqlserver_data` - Persists SQL Server data between container restarts

## Network

- `nokta-network` - Bridge network allowing communication between API and database

## Development Tips

1. **Logs:** View real-time logs with `docker-compose logs -f`
2. **Rebuild:** Use `docker-compose up --build` to rebuild after code changes
3. **Clean up:** Remove all containers and volumes with `docker-compose down -v`
4. **Database access:** Connect to SQL Server using any SQL client at `localhost:1433`

## Production Considerations

For production deployment:

1. Change the SQL Server password in `docker-compose.yml`
2. Use environment-specific appsettings files
3. Configure proper secrets management
4. Set up health checks
5. Use production-grade database hosting
6. Configure HTTPS/SSL certificates 