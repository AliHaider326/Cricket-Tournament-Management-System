# 🏏 Cricket Tournament Management System (CTMS)

A comprehensive web-based Cricket Tournament Management System designed to automate tournament operations including team management, player records, match scheduling, live score management, points table generation, Net Run Rate (NRR) calculations, and statistical analysis.
The system eliminates manual record keeping and spreadsheet-based tournament management by providing a centralized platform for administrators and spectators.

## 📌 Project Overview

Managing cricket tournaments involves handling large amounts of data such as:

* Teams
* Players
* Venues
* Match Fixtures
* Toss Information
* Live Scores
* Tournament Standings
* Statistical Reports

The Cricket Tournament Management System (CTMS) provides an automated solution that allows administrators to efficiently manage tournaments while providing real-time updates and accurate standings.

# ✨ Key Features

## Team Management

* Create, update, and delete teams
* View team profiles
* Track team performance history

## Player Management

* Add player information
* Assign players to teams
* Maintain batting and bowling statistics

## Match Management

* Create tournament fixtures
* Assign venues and match dates
* Record toss details
* Manage match results

## Live Score Management

* Update runs, wickets, and overs
* Track innings progress
* Store scorecards

## Tournament Standings

* Automatic points table generation
* Win/Loss tracking
* Dynamic Net Run Rate (NRR) calculation
* Ranking updates after every match

## Special Match Scenarios

* Reduced Overs Matches
* DLS (Duckworth-Lewis-Stern) Method
* Super Over Matches
* Tied Matches
* Abandoned Matches

## Authentication & Authorization

* Secure Admin Login
* Super Admin Controls
* Password Recovery via Email
* Session Management

## Statistical Analysis

* Batting Strike Rate
* Bowling Economy Rate
* Team Form Analysis
* Match History Reports
* Tournament Statistics Dashboard

# 🏗️ System Architecture

Frontend → REST API → Backend Server → Database

Users interact through a web interface that communicates with backend APIs. The backend processes requests, performs calculations, and stores data in the database.

# 💻 Technology Stack

## Frontend Technologies

### HTML

Used for:

* Page structure
* Forms
* Navigation
* Tables and scorecards

### CSS

Used for:

* Styling
* Responsive layouts
* Tournament dashboards
* Mobile-friendly UI

### JavaScript

Used for:

* Client-side validation
* Dynamic updates
* Interactive components

## Backend Technologies

### Node.js

Used for:

* Server-side processing
* API development
* Business logic implementation
* Authentication handling

### Express.js

Used for:

* REST API development
* Route management
* Middleware integration
* Request handling

### JWT (JSON Web Tokens)

Used for:

* Secure authentication
* Session management
* Protected routes

### bcrypt

Used for:

* Password hashing
* Credential security

## Database Technologies

### MySQL

Used for storing:

* Teams
* Players
* Matches
* Venues
* Scores
* Tournament Data
* User Accounts

Core Database Operations:

* CRUD Operations
* Joins
* Stored Procedures
* Triggers
* Indexing
* Transactions

## API Technologies

### REST API

Used for:

* Data communication between frontend and backend
* Match updates
* Authentication requests
* Statistics retrieval

API Examples:

* GET /teams
* GET /matches
* POST /login
* POST /match/update
* GET /points-table

# 📂 Project Structure



# 🗄️ Database Modules

## Teams

Stores team information.

## Players

Stores player details and statistics.

## Venues

Stores stadium and ground information.

## Matches

Stores fixtures and match results.

## Scorecards

Stores innings and match score details.

## Tournament Standings

Stores points, wins, losses, and NRR.

## Users

Stores admin and super-admin credentials.

# 📊 Net Run Rate (NRR)

The system automatically calculates:

NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled)

This value is updated after every completed match and used for tournament rankings.

# 🔐 Security Features

* Password Hashing using bcrypt
* JWT Authentication
* Protected API Routes
* Input Validation
* SQL Injection Prevention
* Secure Session Management

# 🚀 Installation

## Clone Repository

git clone https://github.com/AliHaider326/cricket-tournament-management-system.git


## Install Dependencies

bash
npm install

## Configure Environment Variables

Create a `.env` file:

env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ctms

JWT_SECRET=your_secret_key

EMAIL_USER=example@gmail.com
EMAIL_PASSWORD=your_email_password


## Run Application

bash
npm start
`

# 📈 Future Enhancements

* Live Ball-by-Ball Commentary
* Mobile Application
* Online Ticket Booking
* Merchandise Store
* AI-Based Match Predictions
* Real-Time Analytics Dashboard
* Multi-Tournament Support

# 👨‍💻 Contributors

### Ali Haider

23K-0848

### Syed Muhammad Rayyan

23K-0624

### Abuzar Ali

23K-0819

# 📄 License

This project is developed for academic and educational purposes as part of a Database Management Systems course project.

Developed as a Database Management Systems (DBMS) course project to demonstrate practical implementation of:

* Database Design
* SQL Development
* Full Stack Web Development
* Authentication Systems
* Sports Tournament Management
* Real-Time Data Processing
