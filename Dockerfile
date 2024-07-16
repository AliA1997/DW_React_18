# Base image for the final build
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Stage to build the React app
FROM node:14 AS react-build
WORKDIR /app/client-app
COPY client-app/package.json client-app/package-lock.json ./
RUN npm install
COPY client-app .
RUN npm run build

# Stage to build the .NET app
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY API/API.csproj API/
COPY Application/Application.csproj Application/
COPY Domain/Domain.csproj Domain/
COPY Persistence/Persistence.csproj Persistence/
COPY Infrastructure/Infrastructure.csproj Infrastructure/
RUN dotnet restore API/API.csproj
COPY . .
WORKDIR /src/API
RUN dotnet build API.csproj -c $BUILD_CONFIGURATION -o /app/build

# Stage to publish the .NET app
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish API.csproj -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage to create the final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Copy the React build output to the wwwroot folder
COPY --from=react-build /app/client-app/build ./wwwroot
ENTRYPOINT ["dotnet", "API.dll"]
