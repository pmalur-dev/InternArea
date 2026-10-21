require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const internshipRoutes = require("./routes/internshipRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://intern-area-chi.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

const trustedOrigins = new Set(allowedOrigins);

app.use((req, res, next) => {
  const methodsThatChangeData = ["POST", "PUT", "PATCH", "DELETE"];

  if (!methodsThatChangeData.includes(req.method)) {
    return next();
  }

  const origin = req.get("Origin");

  if (origin && trustedOrigins.has(origin)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Request origin not allowed",
  });
});

app.use(express.json());

app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  cookie: {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24
  }
  })
);

app.use("/api/auth", authRoutes);

function requestLogger(req, res, next) {
  console.log(`${req.method} ${req.path}`);
  next();
}

app.use(requestLogger);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "InternArea backend is running!",
  });
});

app.use("/api/internships", internshipRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file");
    }
    if (!process.env.SESSION_SECRET) {
      throw new Error("SESSION_SECRET is missing from the .env file");
    }
    
    await connectDB();
    
    
    app.listen(PORT, () => {
      console.log(`InternArea API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start InternArea:", error.message);
    process.exit(1);
  }
}

startServer();
