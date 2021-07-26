import mongoose from 'mongoose';
import morgan from 'morgan';
import express, { Request } from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import { UserDbInterface } from "./types/user";

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
app.use(cors({ origin: "http://localhost:3001", credentials: true }))
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
  cb(null, user._id);
});

passport.deserializeUser((id: string, cb) => {
  User.findOne({ _id: id }, (err: Error, user: UserDbInterface) => {
    const userInformation = {
      email: user.email,
      id: user._id
    };
    cb(err, userInformation);
  });
});

// Routes
app.get("/user", (req, res) => {
  return res.json(req.user);
});

app.post('/register', async (req, res, next) => {

  const { name, email, password } = req?.body;
  if (!name || !email || !password || typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({"message": "Invalid input"});
    return;
  }
  User.findOne({ email }, async (err : Error, doc : UserDbInterface) => {
    if (err) throw err;
    if (doc) res.status(400).json({"message": "User already exists"});
    if (!doc) {
      const passwordDigest = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: passwordDigest
      });
      let user = await newUser.save();
      console.log(user);
      passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(400).send(); }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.status(200).send();
        });
      })(req, res, next);
    }
  })

});

/*
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(401).json({"error": "error"}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.status(200).send(); 
    });
  })(req, res, next);
});
*/
interface RequestWithUser extends Request {
    user?: UserDbInterface;
}

app.post("/login", passport.authenticate("local"), function(req: RequestWithUser, res) {
  let user: UserDbInterface | undefined = req.user;
  return res.json({id: user?._id});
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("success")
});

const stocks = require("./routes/stocks");
app.use("/api/stocks", stocks);

const path = require('path');
// load static build folder in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

app.listen(3000, () => {
  console.log("Server started");
})