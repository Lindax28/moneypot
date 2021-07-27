import express, { Request, Response } from 'express';
import User from '../models/User';
import UserDbInterface from "../types/user";
import passport from 'passport';
import bcrypt from 'bcryptjs';
import RequestWithUser from '../types/requestWithUser';
const mongoose = require("mongoose");
const router = express.Router();

router.post('/register', async (req, res, next) => {

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
        cash_balance: 10000,
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

router.post("/login", passport.authenticate("local"), function(req: RequestWithUser, res) {
  let user: UserDbInterface | undefined = req.user;
  return res.json({id: user?.id});
});

router.get("/logout", (req, res) => {
  req.logout();
  res.send("success")
});

router.get("/user", (req, res) => {
  return res.json(req.user);
});

router.get("/name", async (req: RequestWithUser, res: Response) => {
  let user: UserDbInterface | undefined = req.user;
  let dbUser = await User.findOne({ _id: mongoose.Types.ObjectId(user?.id) })
  return res.json({name: dbUser?.name});
});

export default router;