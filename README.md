# Nokta API

## Overview
Nokta API is a backend service developed as part of a senior project. This API serves as the backend infrastructure for the Nokta application, handling data management and business logic with Docker support.

## Technologies Used
- .NET 8.0
- Entity Framework Core
- SQL Server
- Docker & Docker Compose
- RESTful API principles
- Swagger/OpenAPI

## Prerequisites
- .NET 8.0 SDK or later
- Docker Desktop
- SQL Server (or use Docker Compose for local development)
- Visual Studio 2022 (recommended) or VS Code
- Git

## Getting Started

### Option 1: Using Docker (Recommended)
1. Clone the repository
```bash
git clone https://github.com/sudeal/Nokta.git
cd Nokta-API
```

2. Run with Docker Compose
```bash
docker-compose up --build
```

The API will be available at:
- API: http://localhost:5000
- Swagger UI: http://localhost:5000/swagger

### Option 2: Traditional Setup
1. Clone the repository
```bash
git clone https://github.com/sudeal/Nokta.git
cd Nokta-API
```

2. Restore dependencies
```bash
dotnet restore
```

3. Update the database
```bash
dotnet ef database update
```

4. Run the application
```bash
dotnet run
```

## Docker Support
This project includes comprehensive Docker support:
- `Dockerfile` - Multi-stage build for optimized production images
- `docker-compose.yml` - Local development with SQL Server
- `.dockerignore` - Optimized build context
- `appsettings.Docker.json` - Docker-specific configuration

See `Docker.md` for detailed Docker usage instructions.

## Project Structure
- `Controllers/`: Contains API endpoints (MessagesController)
- `DTOs/`: Data Transfer Objects for API contracts
- `AppDbContext.cs`: Entity Framework database context
- `Models/`: Data models and entities
- `Properties/`: Project configuration
- `Docker files`: Complete Docker setup for containerization

## API Endpoints
- **Messages API**: Complete CRUD operations for messaging system
- **Swagger Documentation**: Available at `/swagger` endpoint

## Configuration
The application can be configured through:
- `appsettings.json` - Production configuration
- `appsettings.Development.json` - Development settings
- `appsettings.Docker.json` - Docker environment settings

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
[Add your license information here]

## Contact
Project Link: [https://github.com/sudeal/Nokta](https://github.com/sudeal/Nokta)
