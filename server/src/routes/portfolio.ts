import express, { Request, Response } from 'express';
import User from '../models/User';
import UserDbInterface from "../types/user";
import passport from 'passport';
import bcrypt from 'bcryptjs';
import RequestWithUser from '../types/RequestWithUser';
import PolygonClient from '../libs/polygon';
import StockInterface from '../types/stock';
import Transaction from 'src/models/Transaction';
const router = express.Router();
const mongoose = require("mongoose");

router.get("/balance", async (req: RequestWithUser, res: Response) => {
  let user: UserDbInterface | undefined = req.user;
  let polygonClient = new PolygonClient();
  
  let dbUser = await User.findOne({_id: mongoose.Types.ObjectId(user?.id)})
  .populate("transactions")
  .exec();
  
  let transactions = dbUser?.transactions;
  let balance = 0;

  if (transactions && transactions.length > 0) {
    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i];
      let stockInfo = await polygonClient.getStock(transaction.stock.toUpperCase());
      balance += stockInfo.results[0].close * transaction.quantity;
    }
  }

  return res.json({"stock_balance": balance, "cash_balance": dbUser?.cash_balance})
});

export default router;