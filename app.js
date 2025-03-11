// app.js
const express = require("express");
const session = require("express-session");
const passport = require("./passportConfig");
const indexRouter = require("./routes/indexRouter");
const path = require("path");
const pool = require("./db/pool");
// require("./passportConfig");
const cookieParser = require("cookie-parser");
const app = express();
const PgSession = require("connect-pg-simple")(session);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "sessions",
      createTableIfMissing: true, // This will attempt to create the table if it doesn't exist
    }),
    secret: process.env.SESSION_SECRET || "keameng1",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Temporarily set to false to test if HTTPS is the issue
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session data:", req.session);
  next();
});

app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

app.use((req, res, next) => {
  console.log(
    "User after passport:",
    req.user ? "Authenticated" : "Not authenticated"
  );
  next();
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
