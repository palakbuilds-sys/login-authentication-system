const dotenv = require("dotenv");
dotenv.config();

console.log("SECRET LOADED:", !!process.env.SESSION_SECRET);

const express = require("express");;
const session = require("express-session");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60
    }
  })
);

// Serve frontend files
app.use(express.static("public"));


// ==============================
// REGISTER
// ==============================

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check fields
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please fill all fields."
    });
  }

  // Read users
  const users = JSON.parse(
    fs.readFileSync("users.json", "utf8")
  );

  // Check if email already exists
  const existingUser = users.find(
    user => user.email === email
  );

  if (existingUser) {
    return res.status(400).json({
      message: "Email is already registered."
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: hashedPassword
  };

  // Add user
  users.push(newUser);

  // Save user
  fs.writeFileSync(
    "users.json",
    JSON.stringify(users, null, 2)
  );

  res.json({
    message: "Registration successful! You can now login."
  });
});


// ==============================
// LOGIN
// ==============================

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check fields
  if (!email || !password) {
    return res.status(400).json({
      message: "Please enter email and password."
    });
  }

  // Read users
  const users = JSON.parse(
    fs.readFileSync("users.json", "utf8")
  );

  // Find user
  const user = users.find(
    user => user.email === email
  );

  // User not found
  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password."
    });
  }

  // Compare password
  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    return res.status(401).json({
      message: "Invalid email or password."
    });
  }

  // Create session
  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  res.json({
    message: "Login successful!"
  });
});


// ==============================
// PROTECTED DASHBOARD
// ==============================

app.get("/dashboard", (req, res) => {

  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect("/");
  }

  // Send dashboard
  res.sendFile(__dirname + "/dashboard.html");
});


// ==============================
// GET CURRENT USER
// ==============================

app.get("/api/user", (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({
      message: "Not authenticated."
    });
  }

  res.json(req.session.user);
});


// ==============================
// LOGOUT
// ==============================

app.post("/logout", (req, res) => {

  req.session.destroy((err) => {

    if (err) {
      return res.status(500).json({
        message: "Logout failed."
      });
    }

    res.json({
      message: "Logout successful."
    });
  });
});


// ==============================
// TEST ROUTE
// ==============================

app.get("/api/test", (req, res) => {
  res.json({
    message: "Authentication server is working!"
  });
});


// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});