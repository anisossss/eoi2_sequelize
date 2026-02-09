# Sequelize Web Stack Demo

**CSIR EOI Submission** — EOI No. 8121/10/02/2026  
Demonstrates proficiency in **ReactJS**, **Node.js**, **Express.js**, and **Sequelize ORM**.

---

## Architecture Overview

```
┌─────────────┐     ┌──────────────────┐     ┌────────────┐
│   React UI  │────▶│  Express.js API   │────▶│ PostgreSQL │
│  (Port 3000)│◀────│   (Port 4000)     │◀────│ (Port 5432)│
└─────────────┘     └──────────────────┘     └────────────┘
                           │
                    Sequelize ORM v6
```

## Tech Stack

| Layer      | Technology                  | Version |
|------------|-----------------------------|---------|
| Frontend   | React                       | 18.2    |
| Backend    | Express.js                  | 4.18    |
| ORM        | Sequelize                   | 6.35    |
| Database   | PostgreSQL                  | 15      |
| Auth       | JWT (jsonwebtoken)          | 9.0     |
| Testing    | Jest + Supertest            | 29.7    |
| Container  | Docker + Docker Compose     | —       |

## Data Model

```
┌──────────────┐       ┌──────────────┐
│    Sensor    │       │   Reading    │
├──────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)      │
│ name         │  │    │ sensorId(FK) │
│ type         │  └───▶│ value        │
│ location     │       │ unit         │
│ status       │       │ timestamp    │
│ createdAt    │       │ createdAt    │
│ updatedAt    │       │ updatedAt    │
└──────────────┘       └──────────────┘
        hasMany ──────────▶ belongsTo
```

## Quick Start

### Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- PostgreSQL: localhost:5432

### Manual Setup

#### Backend

```bash
cd backend
npm install
npm run seed    # Seed the database
npm start       # Start the server on port 4000
```

#### Frontend

```bash
cd frontend
npm install
npm start       # Start React dev server on port 3000
```

## API Endpoints

| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| GET    | `/api/health`          | Health check with DB status    |
| GET    | `/api/sensors`         | List all sensors (with count)  |
| POST   | `/api/sensors`         | Create a new sensor            |
| GET    | `/api/sensors/:id`     | Get sensor with recent readings|
| POST   | `/api/readings`        | Record a new reading           |
| GET    | `/api/readings`        | Query readings (filter/limit)  |
| POST   | `/api/auth/register`   | Register a new user            |
| POST   | `/api/auth/login`      | Login and receive JWT          |

## Running Tests

```bash
cd backend
npm test
```

Tests use SQLite in-memory for fast isolated execution (8+ test cases).

## Project Structure

```
EIO2_sequelize/
├── backend/
│   ├── src/
│   │   ├── server.js             # Express.js entry point
│   │   ├── config/database.js    # Sequelize configuration
│   │   ├── models/               # Sequelize model definitions
│   │   ├── routes/               # Express route handlers
│   │   ├── middleware/           # Auth & error middleware
│   │   └── seeders/seed.js      # Database seeder
│   ├── tests/                   # Jest + Supertest tests
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   ├── components/          # React components
│   │   ├── services/api.js      # Axios API client
│   │   └── styles/app.css       # Application styles
│   ├── public/index.html
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Key Sequelize Features Demonstrated

- **Model definitions** with DataTypes and validations
- **Associations**: `hasMany` / `belongsTo`
- **Eager loading** with `include`
- **Aggregations** using `Sequelize.fn` and `Sequelize.col`
- **Migrations-ready** configuration via `.sequelizerc`
- **Transaction support** in seeder
- **Hooks** for password hashing (User model)

---

*Built for CSIR EOI No. 8121/10/02/2026*
