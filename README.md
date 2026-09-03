# CampusBook

CampusBook is a web-based appointment booking system designed for student-run service businesses on university campuses.

The platform allows students to discover service providers, view their services, select appointment dates and times, book appointments, and track booking status. Service providers can create business profiles, manage services, define their availability, and manage appointments from a dashboard.

The project was developed as an academic mini-project to reduce the stress and inefficiency that comes with managing bookings manually through phone calls, WhatsApp messages, and direct messages.

---

## Project Overview

Many students run small service businesses on campus, such as:

- Nail technicians
- Lash technicians
- Wig makers
- Barbers
- Hair stylists
- Makeup artists
- Photographers
- Tutors
- Graphic designers
- Other student service providers

A major challenge is that appointments are often handled manually through calls and messages.

This can lead to:

- Double bookings
- Missed appointments
- Time conflicts
- Repeated calls and messages
- Poor organization
- Difficulty tracking customers
- Difficulty knowing when a provider is available

CampusBook provides a centralized booking system where students can book service providers based on their real availability.

---

## Main Features

### Student Features

Students can:

- Register for an account
- Login to the system
- Browse available service providers
- View provider profiles
- View services and prices
- View service durations
- Select an appointment date
- View available appointment times
- Book appointments
- View their bookings
- Track booking status

Booking statuses include:

- `PENDING`
- `CONFIRMED`
- `COMPLETED`
- `CANCELLED`

---

## Service Provider Features

Service providers can:

- Register as a provider
- Login to the system
- Create a business profile
- Add a business name
- Select a service category
- Add campus location
- Add services
- Set service prices
- Set service durations
- Edit services
- Delete services
- Set working days
- Set opening and closing times
- View appointments
- Confirm bookings
- Cancel bookings
- Mark appointments as completed

---

## Technologies Used

### Frontend

- **Next.js** — React framework used for building the web application
- **React** — Used for the user interface
- **TypeScript** — Adds type safety to the project
- **Tailwind CSS** — Used for styling and responsive design
- **HTML/CSS** — Used for the structure and presentation of the interface

### Backend

- **Next.js API Routes** — Used to create backend API endpoints
- **Node.js** — JavaScript runtime used by the application

### Database

- **PostgreSQL** — Relational database used to store application data
- **Supabase** — Cloud-hosted PostgreSQL database service

### ORM

- **Prisma ORM** — Used to communicate with PostgreSQL and manage database models

### Development Tools

- **Visual Studio Code** — Main code editor
- **Git** — Version control
- **GitHub** — Source-code hosting
- **Prisma Studio** — Used to view and manage database records
- **Supabase Dashboard** — Used to manage the cloud database

---

## System Architecture

CampusBook follows a web-based client-server architecture.

```text
Student / Provider
        ↓
   Web Browser
        ↓
Next.js User Interface
        ↓
Next.js API Routes
        ↓
    Prisma ORM
        ↓
PostgreSQL Database
     (Supabase)

The frontend communicates with the backend through API routes.

The backend uses Prisma ORM to read and write information in the Supabase PostgreSQL database.

---
# How to Clone and Run the Project

Follow the steps below to run CampusBook on another computer.

---

## Step 1: Install the Required Software

Make sure the following are installed:

- Node.js
- npm
- Git

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

Check Git:

```bash
git --version
```

If version numbers appear, the tools are installed correctly.

---

## Step 2: Clone the Repository

Open PowerShell, Command Prompt, Git Bash, or another terminal.

Run:

```bash
git clone https://github.com/latif2828/campusbook.git
```

This downloads the CampusBook source code.

---

## Step 3: Enter the Project Folder

Run:

```bash
cd campusbook
```

---

## Step 4: Install Project Dependencies

Run:

```bash
npm install
```

This installs all packages listed in `package.json`.

---

## Step 5: Create the Environment File

The `.env` file is not stored on GitHub because it contains database credentials.

Create a file named:

```text
.env
```

inside the root of the project.

Example structure:

```text
campusbook/
│
├── app/
├── components/
├── prisma/
├── .env
├── package.json
└── README.md
```

Add the required environment variables:

```env
DATABASE_URL="your_supabase_postgresql_connection_string"

NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"

NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

Replace the sample values with the credentials from your Supabase project.

---

## Step 6: Generate Prisma Client

Run:

```bash
npx prisma generate
```

This generates Prisma Client based on the database schema.

---

## Step 7: Apply Database Migrations

Run:

```bash
npx prisma migrate dev
```

This creates or updates the database tables.

The project currently contains migrations for:

- Initial database setup
- Application models
- Provider availability

---

## Step 8: Start the Development Server

Run:

```bash
npm run dev
```

The terminal should show that the application is running.

---

## Step 9: Open CampusBook

Open a browser and visit:

```text
http://localhost:3000
```

CampusBook should now be running locally.

---

# Quick Installation

After setting up the `.env` file, the main commands are:

```bash
git clone https://github.com/latif2828/campusbook.git
cd campusbook
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Then visit:

```text
http://localhost:3000
```

---