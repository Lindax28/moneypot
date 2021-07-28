import express, { Response } from 'express';
import User from '../models/User';
import UserDbInterface from "../types/user";
import PolygonClient from "../libs/polygon";
import RequestWithUser from '../types/requestWithUser';
import mongoose from "mongoose";
const router = express.Router();

// Retrieve user cash balance and quantity of stock owned for given stock symbol
router.get("/balance/:symbol", async (req: RequestWithUser, res: Response) => {
  let user: UserDbInterface | undefined = req.user;

  let dbUser = await User.findOne({ _id: mongoose.Types.ObjectId(user?.id) })
    .populate("transactions")
    .exec();

  let transactions = dbUser?.transactions;
  let quantity = 0;
  if (transactions && transactions.length > 0) {
    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i];
      if (transaction.stock.toUpperCase() === req.params.symbol.toUpperCase()) {
        quantity += transaction.quantity;
      }
    }
  }

  return res.json({ cash_balance: dbUser?.cash_balance, quantity });
});

// Retrieve number of shares and closing price for all stock owned by current user and user cash balance 
router.get("/shares", async (req: RequestWithUser, res: Response) => {
  let polygonClient = new PolygonClient();
  let user: UserDbInterface | undefined = req.user;

  let dbUser = await User.findOne({ _id: mongoose.Types.ObjectId(user?.id) })
    .populate("transactions")
    .exec();

  let transactions = dbUser?.transactions;
  let shares : any = {};
  let price: any = {};

  try {
    if (transactions && transactions.length > 0) {
      for (let i = 0; i < transactions.length; i++) {
        let transaction = transactions[i];
        if (shares[transaction.stock] > 0) {
          shares[transaction.stock] += transaction.quantity;
        } else {
          shares[transaction.stock] = transaction.quantity;
        }
      }
      let stocks = Object.keys(shares);
      let stock;
      for (let i = 0; i < stocks.length; i++) {
        stock = stocks[i];
        // Polygon API request for stock info - only closing price used here
        let stockInfo = await polygonClient.getStock(stock.toUpperCase());
        price[stock] = stockInfo.results[0].close;
      }
      return res.json({ shares, price, cash_balance: dbUser?.cash_balance });
    }
  } catch (err) {
    console.warn(err);
    return res.status(404).send();
    }
  return res.status(404).send();
});

export default router;