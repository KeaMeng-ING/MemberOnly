// app.js
const express = require("express");
const session = require("express-session");
const passport = require("./passportConfig");
const indexRouter = require("./routes/indexRouter");
const path = require("path");
const pool = require("./db/pool");
require("./passportConfig");
const cookieParser = require("cookie-parser");
const app = express();
const PgSession = require("connect-pg-simple")(session);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(
  session({
    store: new PgSession({
      pool, // Use the same pool as your database
      tableName: "sessions", // Name of the table to store sessions
    }),
    secret: process.env.SESSION_SECRET || "keameng1", // Use a strong secret in production
    resave: false, // Don't resave session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
      maxAge: 24 * 60 * 60 * 1000, // Session expires after 24 hours
    },
  })
);

app.use(passport.session());

app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

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
