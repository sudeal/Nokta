# Nokta API

## Overview
Nokta API is a backend service developed as part of a senior project. This API serves as the backend infrastructure for the Nokta application, handling data management and business logic.

## Technologies Used
- .NET Core
- Entity Framework Core
- SQL Server
- RESTful API principles

## Prerequisites
- .NET 6.0 SDK or later
- SQL Server
- Visual Studio 2022 (recommended) or VS Code
- Git

## Getting Started

### Installation
1. Clone the repository
```bash
git clone https://github.com/tegemenozyurek/SeniorProject-Backend.git
```

2. Navigate to the project directory
```bash
cd Nokta-API
```

3. Restore dependencies
```bash
dotnet restore
```

4. Update the database
```bash
dotnet ef database update
```

5. Run the application
```bash
dotnet run
```

The API will start running on `https://localhost:7223` by default.

## Project Structure
- `Controllers/`: Contains API endpoints
- `Models/`: Data models and entities
- `Services/`: Business logic implementation
- `Data/`: Database context and configurations
- `Migrations/`: Database migration files

## API Endpoints
(Document your main API endpoints here)

## Configuration
The application can be configured through `appsettings.json`. Make sure to update the following settings:
- Database connection string
- JWT settings (if applicable)
- Any other environment-specific settings

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
[Add your license information here]

## Contact
Your Name - [@your_github_username](https://github.com/tegemenozyurek)

Project Link: [https://github.com/tegemenozyurek/SeniorProject-Backend](https://github.com/tegemenozyurek/SeniorProject-Backend)
