# Use the official .NET 8.0 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the project files
COPY *.csproj ./
COPY *.sln ./

# Restore dependencies
RUN dotnet restore

# Copy the entire source code
COPY . ./

# Build the application
RUN dotnet build -c Release --no-restore

# Publish the application
RUN dotnet publish -c Release --no-build -o /app/publish

# Use the official .NET 8.0 runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Set the working directory
WORKDIR /app

# Copy the published app from the build stage
COPY --from=build /app/publish .

# Expose the port the app runs on
EXPOSE 8080
EXPOSE 8081

# Set the entry point
ENTRYPOINT ["dotnet", "Nokta-API.dll"] 