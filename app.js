const express = require('express');
const session = require('express-session');
const { regd_users } = require('./router/auth_users'); // Registered user routes
const { public_users } = require('./router/general');  // Public routes
const { authenticateToken } = require('./router/auth_middleware'); // Middleware for authentication

const app = express();
const PORT = 5000;

// Middleware for JSON parsing
app.use(express.json());

// Session configuration
app.use(
    "/customer",
    session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true })
);

// Protected routes middleware
app.use("/customer/auth/*", authenticateToken);

// Routes
app.use("/customer", regd_users);  // Authenticated routes
app.use("/", public_users);        // Public routes

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
