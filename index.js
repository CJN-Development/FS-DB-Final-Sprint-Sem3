if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const methodOverride = require("method-override");
const app = express();
const PORT = 3000;

const logEvents = require("./logevents");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

global.DEBUG = true;

const bcrypt = require("bcrypt");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const flash = require("express-flash");
const session = require("express-session");
const uuid = require("uuid");
const logins = require("./services/p.logins.dal"); // use POSTGRESQL dal

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  let user = await logins.getLoginById(id);
  if (DEBUG) console.log("passport.deserializeUser: " + user);
  done(null, user);
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

passport.use(
  new localStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      let user = await logins.getLoginByEmail(email);
      if (user == null) {
        return done(null, false, { message: "No user with that email." });
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "Incorrect password was entered.",
          });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.username });
});

const searchRouter = require("./routes/search");

app.use("/search", searchRouter);

app.get("/searchpage", checkAuthenticated, (req, res) => {
  res.render("searchpage");
});

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

app.get("/search", (req, res) => {
  const keyword = req.query.q;
  const database = req.query.db;

  const searchResults = searchDatabase(keyword, database);
  res.render("searchResult", { Database: database, aSearch: searchResults });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});
app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/about", (req, res) => {

   res.render("about.ejs");
  
  });
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});
app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let result = await logins.addLogin(
      req.body.name,
      req.body.email,
      hashedPassword,
      uuid.v4()
    );
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/register");
  }
});

app.delete("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return next();
}

app.use((req, res) => {
  
  res.status(404).render("404");
  
});

//404 Error Page
app.get("/404", (request, response) => {
  response.render("404.ejs");
});

//503 Error Page
app.get("/503", (request, response) => {
  response.render("503.ejs");
});

//No record Error page
app.get("/norecord", (request, response) => {
  response.render("norecord.ejs");
});

app.listen(PORT, () => {
  console.log(`Simple app running on port ${PORT}.`);
});
