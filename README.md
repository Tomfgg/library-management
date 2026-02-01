# Library Management System

A backend REST API built with **NestJS**, **Prisma**, and **PostgreSQL** for managing books, borrowers, and borrowing processes. The system supports authentication, borrowing workflows, analytical reports, exports, and basic security measures.

This project was developed as a technical assessment with focus on **simplicity**, **clean architecture**, and **practical functionality**.

---

## 📚 Features

### Core Features
- Borrower registration & authentication (JWT)
- CRUD operations for Books
- CRUD operations for Borrowers
- Checkout / Return books
- Prevent borrowing unavailable books
- Track borrowing history
- Role-based access (Admin / Borrower)
- Input validation using DTOs + class-validator
- Centralized exception handling

### Reports & Analytics (Bonus)
- Borrowing analytics for a specific period
- Export overdue borrowings of last month (XLSX)
- Export all borrowing processes of last month (XLSX)

### Security & Quality (Bonus)
- JWT Authentication
- Rate limiting on selected endpoints
- Swagger API documentation
- Prisma ORM (prevents SQL injection by design)
- Password hashing with bcrypt
- Environment-based configuration

---

## 🛠️ Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Security:** bcrypt

---

## 🗄️ Database Design

### Entity Relationship Diagram

![ERD](docs/erd.png)

### Entities
- **Borrower**
- **Book**
- **Borrowing**

### Relationships
```
Borrower 1 --- * Borrowing * --- 1 Book
```

Borrowing acts as a junction table between Borrower and Book.

### Key Fields
- `Borrowing.borrowerId` → `Borrower.id`
- `Borrowing.bookId` → `Book.id`
- `returnedAt` is nullable (null = active borrowing)

---

## API Collection (Postman)

Postman collection is available at:

docs/postman/library-management.postman_collection.json

---

## 🚀 Installation Guide Using Docker

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/Tomfgg/library-management.git
cd library-management-system
```

#### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

#### 2. Run Docker Compose

```bash
docker compose up
```

## 🚀 Installation Guide

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** v20.19.0 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** v12 or higher ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/Tomfgg/library-management.git
cd library-management-system
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/librarydb"
PORT=3000
```

> **Note:** Replace `username` and `password` with your PostgreSQL credentials.

#### 4. Create the Database

**Option A: Using Command Line**

```bash
createdb librarydb
```

**Option B: Using psql**

```bash
psql -U postgres
CREATE DATABASE librarydb;
\q
```

**Option C: Using pgAdmin or any PostgreSQL GUI**

- Open pgAdmin
- Right-click on "Databases" → "Create" → "Database"
- Enter name: `librarydb`

#### 5. Setup Database Schema

Generate Prisma Client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

#### 6. Start the Application

**Development mode:**

```bash
npm run start:dev
```

**Production mode:**

```bash
npm run build
npm run start:prod
```

### Verify Installation

Visit [http://localhost:3000](http://localhost:3000) in your browser to confirm the application is running.

---

## 🔧 Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Check your `DATABASE_URL` in `.env` is correct

3. Ensure the database exists:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

If port 3000 is already in use, change the `PORT` in your `.env` file:

```env
PORT=3001
```

---

## 📊 Reports

### Available Reports

**Export Overdue Borrowings (Last Month)**

```
GET /reports/overdue-last-month
```

- **Format:** XLSX

**Export All Borrowing Processes (Last Month)**

```
GET /reports/borrowings-last-month
```

- **Format:** XLSX

**Borrowings For Specific Period**

```
GET /reports//borrowings-per-period?from=YYYY-MM-DD&ro=YYYY-MM-DD
```

- **Format:** XLSX

---

## 🔒 Security Features

### Rate Limiting

Applied only to:
- Checkout endpoint
- Return endpoint

Other endpoints are unrestricted.

### Security Measures

- **Prisma ORM:** Uses parameterized queries (prevents SQL injection)
- **DTO Validation:** Input validation with class-validator
- **Password Security:** bcrypt password hashing
- **Authentication:** JWT guards for protected routes
- **Rate Limiting:** Prevents abuse on critical endpoints
- **ValidationPipe:** Configured with whitelist to strip unknown properties

---

## 🏗️ Design Decisions

- **Data Integrity:** Deleting borrowers/books with active borrowings is prevented
- **Historical Data:** Historical borrowings are preserved for audit purposes
- **Updates:** `PartialType` used for flexible update operations
- **Password Security:** Password is rehashed only when explicitly provided in updates
- **Modular Architecture:** Reports isolated in dedicated module
- **Global Modules:** Prisma module is configured as global for easy access

---

## 🤝 Support

For issues or questions, please:
- Open an issue in the [GitHub repository](https://github.com/Tomfgg/library-management/issues)
- Contact the development team

---

## 👨‍💻 Author

**Omar Zain**  
Backend Engineer

---

## 📄 License

This project is part of a technical assessment.
