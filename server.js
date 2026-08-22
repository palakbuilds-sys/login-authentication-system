require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;

const USERS_FILE = path.join(__dirname, "users.json");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "my-super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  maxAge: 1000 * 60 * 60
}
  })
);

app.use(express.static(path.join(__dirname, "public")));

// ----------------------------
// Helper functions
// ----------------------------

function getUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify(users, null, 2)
  );
}

// ----------------------------
// Home / Login page
// ----------------------------

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

// ----------------------------
// Register
// ----------------------------

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const users = getUsers();

    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    saveUsers(users);

    res.json({
      success: true,
      message: "Registration successful"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ----------------------------
// Login
// ----------------------------

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = getUsers();

    const user = users.find(
      (user) => user.email === email
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ----------------------------
// Protected Dashboard
// ----------------------------

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  res.sendFile(
    path.join(__dirname, "public", "dashboard.html")
  );
});

// ----------------------------
// Get logged-in user
// ----------------------------

app.get("/api/user", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Not logged in"
    });
  }

  res.json({
    success: true,
    user: req.session.user
  });
});

// ----------------------------
// Logout
// ----------------------------

app.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Logout failed"
      });
    }

    res.clearCookie("connect.sid");

    res.json({
      success: true,
      message: "Logged out successfully"
    });
  });
});

// ----------------------------
// 404
// ----------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found."
  });
});

// ----------------------------
// Start Server
// ----------------------------

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});