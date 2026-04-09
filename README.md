# Bank Project

A backend API for a banking system built with Node.js, Express.js, and MongoDB. This project provides user authentication, account management, transaction processing, and ledger tracking for a simulated banking environment.

## Description

This is a comprehensive backend application for managing banking operations. Users can register, log in, create accounts, perform transactions, and view their account balances. The system includes features like transaction reversals, account freezing, and a blacklist for security. It's designed as a learning project for backend development with modern JavaScript (ES modules), authentication, and database management.

## Features

- **User Authentication**: Secure registration, login, and logout with JWT tokens and bcrypt password hashing.
- **Account Management**: Create, view, and manage user accounts with status tracking (ACTIVE, FROZEN, CLOSED).
- **Transaction Processing**: Support for various transaction types including MINT, TRANSFER, REVERSAL, and WITHDRAWAL.
- **Ledger System**: Maintains a detailed ledger for all account activities.
- **Email Notifications**: Integrated email service for user communications.
- **Security Features**: Blacklist for blocked users, middleware for authentication and authorization.
- **System Admin Functions**: Special routes for system users (e.g., initial fund transfers).

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT), bcrypt for password hashing
- **Email**: Nodemailer for email services
- **Other**: Cookie-parser for session management, dotenv for environment variables

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: Version 16 or higher (download from [nodejs.org](https://nodejs.org/))
- **MongoDB**: Local installation or a cloud instance (e.g., MongoDB Atlas)
- **npm**: Comes with Node.js installation

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd BankProject
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/bankproject  # Or your MongoDB connection string
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   PORT=3000  # Optional, defaults to 3000
   ```

4. **Start MongoDB**:
   Ensure MongoDB is running on your system or update the `MONGO_URI` to point to your database instance.

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```
Starts the server normally.

The server will run on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Accounts
- `POST /api/accounts` - Create a new account (authenticated)
- `GET /api/accounts` - Get all user accounts (authenticated)
- `GET /api/accounts/balance/:accountId` - Get account balance (authenticated)

### Transactions
- `POST /api/transactions` - Create a new transaction (authenticated)
- `POST /api/transactions/system/initial-funds` - Initial fund transfer (system user only)

## Project Structure

```
BankProject/
├── package.json          # Project dependencies and scripts
├── server.js             # Application entry point
├── src/
│   ├── app.js            # Express app configuration
│   ├── config/
│   │   └── db.js         # Database connection
│   ├── controllers/      # Route handlers
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   └── transaction.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js  # Authentication middleware
│   ├── models/           # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── account.model.js
│   │   ├── transaction.model.js
│   │   ├── ledger.model.js
│   │   └── blacklist.model.js
│   ├── routes/           # API routes
│   │   ├── auth.routes.js
│   │   ├── accounts.routes.js
│   │   └── transaction.routes.js
│   └── services/
│       └── email.service.js  # Email service
└── README.md             # This file
```

## Environment Variables

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `EMAIL_USER`: Email address for sending notifications
- `EMAIL_PASS`: Password for the email account
- `PORT`: Server port (optional, defaults to 3000)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Notes

- This is a learning project and should not be used in production without additional security measures.
- Ensure all environment variables are properly configured before running.
- The system includes a blacklist model for security, but implementation details may vary.</content>
<parameter name="filePath">c:\Users\PMLS\Documents\Mahir\Backend COurse\BankProject\README.md