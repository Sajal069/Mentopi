// Import necessary modules
import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import nodemailer from "nodemailer";
import { users, saveUsers } from "./data/users.js";
import Razorpay from "razorpay";
import crypto from "crypto"; // Import crypto for signature verification

// Initialize app
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
    user: "your-email@gmail.com", // replace with your email
    pass: "your-email-password", // replace with your email password
  },
});

// Razorpay setup
const razorpay = new Razorpay({
  key_id: "your_razorpay_key_id", // Replace with your Razorpay key id
  key_secret: "your_razorpay_key_secret", // Replace with your Razorpay key secret
});

// Routes
app.get("/", (req, res) => {
  res.render("Home.ejs", { user: req.user });
});

app.get("/Courses", (req, res) => {
  res.render("Courses.ejs", { user: req.user });
});

app.get("/Reviews", (req, res) => {
  res.render("Reviews.ejs", { user: req.user });
});

app.get("/AboutUs", (req, res) => {
  res.render("AboutUs.ejs", { user: req.user });
});

app.get("/Help", (req, res) => {
  res.render("Help.ejs", { user: req.user });
});

app.get("/Become-A-Topper", (req, res) => {
  res.render("BecomeAtopper.ejs", { user: req.user });
});

app.get("/JEE-Mains-Booster", (req, res) => {
  res.render("JEEmainsBooster.ejs", { user: req.user });
});

app.get("/Download-Free-Book", (req, res) => {
  res.render("HVCO.ejs", { user: req.user });
});

// Define course routes
const courses = {
  "BAT-level-1": { price: 699, page: "BAT-level-1-payment.ejs" },
  "BAT-level-2": { price: 999, page: "BAT-level-2-payment.ejs" },
  "BAT-level-3": { price: 3500, page: "BAT-level-3-payment.ejs" },
};

Object.keys(courses).forEach((courseCode) => {
  app.get(`/${courseCode}`, (req, res) => {
    if (req.isAuthenticated()) {
      res.render(courses[courseCode].page, { user: req.user, courseCode });
    } else {
      res.redirect("/login");
    }
  });

  app.post(`/create-order/${courseCode}`, (req, res) => {
    const course = courses[courseCode];
    const options = {
      amount: course.price * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${courseCode}_${Date.now()}`,
    };
    razorpay.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).send("Error creating order");
      }
      res.json(order);
    });
  });

  app.post(`/verify-payment/${courseCode}`, async (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(body.toString())
      .digest("hex");
    const isAuthentic = expectedSignature === signature;

    if (isAuthentic) {
      req.user.courses.push(courseCode);
      saveUsers(users);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// Authentication routes
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

// Payment success and failure routes
app.get("/payment-success", (req, res) => {
  res.render("payment-success.ejs", { user: req.user });
});

app.get("/payment-failed", (req, res) => {
  res.render("payment-failed.ejs", { user: req.user });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
