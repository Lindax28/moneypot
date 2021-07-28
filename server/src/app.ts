import mongoose from 'mongoose';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import UserDbInterface from "./types/user";
import stocksRoute from './routes/stocks';
import sessionRoute from './routes/session';
import portfolioRoute from './routes/portfolio';

dotenv.config();
mongoose.connect(`mongodb+srv://dev:${process.env.MONGO_PASSWORD}@moneypot.euzhx.mongodb.net/Moneypot?retryWrites=true&w=majority`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err : Error) => {
    if (err) throw err;
    console.log("Connected to Mongo")
});

// Middleware
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_BASE_URL, credentials: true }));
app.use(
  session({
    secret: "password",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("combined"));

// Passport
const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"}, 
  (email: string, password: string, done) => {
  User.findOne({ email: email }, (err: Error, user: UserDbInterface) => {
    console.log(err, user);
    if (err) throw err;
    if (!user) return done(null, false);
    bcrypt.compare(password, user.password, (err, result: boolean) => {
      if (err) throw err;
      if (result === true) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  });
})
);

passport.serializeUser((user: UserDbInterface, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id: string, cb) => {
  User.findOne({ _id: id }, (err: Error, user: UserDbInterface) => {
    const userInformation = {
      email: user.email,
      id: user.id
    };
    cb(err, userInformation);
  });
});

// Routes
app.use("/api/stocks", stocksRoute);
app.use("/api/portfolio", portfolioRoute);
app.use("", sessionRoute);

const path = require('path');
// load static build folder in production
if (process.env.NODE_ENV === "production") {
  console.log("running in production");
  app.use(express.static("../client/build"));
  app.get("*", (req, res) => {
    let dir = path.join(__dirname, "../../client/build/index.html");
    res.sendFile(dir);
  });
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server started");
})