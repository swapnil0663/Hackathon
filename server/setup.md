# Server Setup Instructions

## 1. Database Setup (PostgreSQL)

### Install PostgreSQL
- Download and install PostgreSQL from https://www.postgresql.org/download/
- Remember the password you set for the `postgres` user

### Create Database
```sql
-- Connect to PostgreSQL as postgres user
psql -U postgres

-- Create database
CREATE DATABASE complaintrack;

-- Connect to the database
\c complaintrack;

-- Run the schema.sql file
\i database/schema.sql
```

## 2. Environment Configuration

### Copy and configure .env file
```bash
cp .env.example .env
```

### Update .env with your PostgreSQL credentials
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=complaintrack
DB_USER=postgres
DB_PASSWORD=your_actual_password
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

## 3. Install Dependencies and Run
```bash
npm install
npm run dev
```

## 4. Test the Server
- Visit http://localhost:5000 - should show "ComplainTrack API is running!"
- Visit http://localhost:5000/api/test - should show test response

## 5. Frontend Connection
- Frontend runs on http://localhost:5173
- API calls go to http://localhost:5000/api
- CORS is configured for localhost:5173