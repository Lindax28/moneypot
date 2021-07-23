import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';

mongoose.connect("mongodb+srv://dev:i2NRitD0NFDTt2Lr@moneypot.euzhx.mongodb.net/Moneypot?retryWrites=true&w=majority", {
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
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(
  session({
    secret: "password",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Router
app.post('/register', async (req: Request, res: Response) => {
  const passwordDigest = await bcrypt.hash(req.body.password, 10);
});