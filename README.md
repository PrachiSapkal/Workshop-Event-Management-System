# Workshop Event Management Platform

A full-stack Workshop & Event Management Platform built using ASP.NET Core, Angular, and SQL Server. The application provides secure authentication, workshop management, event booking, and feedback functionalities through a RESTful architecture.

## Features

- JWT-based authentication and authorization
- Workshop and event management
- Event booking and registration
- Feedback management
- RESTful APIs
- SQL Server integration with Entity Framework Core

## Tech Stack

**Frontend**
- Angular
- TypeScript
- HTML
- CSS

**Backend**
- ASP.NET Core
- C#
- Entity Framework Core

**Database**
- SQL Server

## Project Structure

```
.
├── angularapp/      # Angular frontend
├── dotnetapp/       # ASP.NET Core Web API
├── TestProject/     # Unit tests
└── README.md
```

## Getting Started

```bash
git clone https://github.com/PrachiSapkal/Workshop-Event-Management-System.git
```

Configure the database connection string and JWT secret in `appsettings.Development.json`, then run:

```bash
# Backend
cd dotnetapp
dotnet restore
dotnet run

# Frontend
cd angularapp
npm install
ng serve
```

## Author

**Prachi Sapkal**

GitHub: https://github.com/PrachiSapkal
