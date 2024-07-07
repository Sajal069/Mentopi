import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import nodemailer from "nodemailer";
import { users, saveUsers } from "./data/users.js";

const app = express();
const port = 3000;
const saltRounds = 10;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sharmasajal069@gmail.com", // replace with your email
    pass: "work25x7", // replace with your email password
  },
});

// Routes
app.post("/subscribe", (req, res) => {
  const { email, name } = req.body;

  const mailOptions = {
    from: "sharmasajal069@gmail.com", // replace with your email
    to: "contact@mentopi.com",
    subject: "New Newsletter Subscription",
    text: `A new user has subscribed to the newsletter.\n\nName: ${name}\nEmail: ${email}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error subscribing to newsletter.");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Subscription successful.");
    }
  });
});

app.get("/", (req, res) => {
  res.render("Home.ejs", { user: req.user });
});

app.get("/Courses", (req, res) => {
  res.render("Courses.ejs", { user: req.user });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/myaccount", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("MyAccount.ejs", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).send("Error logging out.");
    }
    res.redirect("/");
  });
});

app.post("/register", async (req, res) => {
  const { username: email, password, phone, name } = req.body;

  if (users[email]) {
    res.send("Email already exists. Try logging in.");
  } else {
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      users[email] = {
        email,
        password: hash,
        phone,
        name,
        courses: [],
      };
      saveUsers(users);
      req.login(users[email], (err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      });
    } catch (err) {
      console.error("Error hashing password:", err);
      res.status(500).send("Error registering user.");
    }
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const user = users[username];
    if (!user) {
      return cb(null, false, { message: "User not found" });
    }

    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return cb(null, user);
      } else {
        return cb(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.email);
});

passport.deserializeUser((email, cb) => {
  const user = users[email];
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
