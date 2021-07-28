import express, { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import PolygonClient from '../libs/polygon';
import StockInterface from '../types/stock';
import UserDbInterface from '../types/user';
import RequestWithUser from '../types/requestWithUser';
import User from '../models/User';
import mongoose from 'mongoose';
const router = express.Router();

router.get("/:symbol", async (req: Request, res: Response) => {
  let symbol = req.params.symbol;
  let polygonClient = new PolygonClient();
  try {
    let stockInfo = await polygonClient.getStock(symbol.toUpperCase());
    let companyInfo = await polygonClient.getCompany(symbol.toUpperCase());
    if (stockInfo && stockInfo.results.length > 0) {
      let details = stockInfo.results[0];
      let stock: StockInterface = {
        symbol: details.tickerSymbol!,
        volume: details.volume,
        open: details.open,
        close: details.close,
        high: details.high,
        low: details.low,
        listdate: companyInfo.listdate!,
        industry: companyInfo.industry!,
        sector: companyInfo.sector!,
        country: companyInfo.country?.toUpperCase()!,
        marketcap: companyInfo.marketcap!,
        employees: companyInfo.employees!,
        ceo: companyInfo.ceo!,
        url: companyInfo.url!,
        description: companyInfo.description!,
        exchange: companyInfo.exchange,
        name: companyInfo.name,
        similar: companyInfo.similar!
      }
      return res.json(stock);
    }
  } catch (err) {
    console.warn(err);
    return res.status(404).send();
  }
  return res.status(404).send();
})

router.post("/trade", async (req: RequestWithUser, res: Response) => {
  let user: UserDbInterface | undefined = req.user;
  let polygonClient = new PolygonClient();
  let { stock, quantity } = req.body;
  let dbUser = await User.findOne({_id: mongoose.Types.ObjectId(user?.id)})
  .populate("transactions").exec();
  let cash_balance = dbUser?.cash_balance;
  let stockInfo = await polygonClient.getStock(stock.toUpperCase());
  let price = stockInfo.results[0].close;

  if (quantity > 0) {
    if (cash_balance && cash_balance > (quantity * price)) {
      if (dbUser && dbUser.cash_balance) {
        dbUser.cash_balance = cash_balance - (quantity * price);
        const newTrade = new Transaction({
          stock: req.body.stock.toUpperCase(),
          price,
          quantity: req.body.quantity,
          user: dbUser,
        });
        await newTrade.save();
        dbUser.transactions.push(newTrade);
        await dbUser.save();
        return res.status(204).send();
      }
    } else {
      return res.status(400).json({"message": "Insufficient funds"});
    }
  } else {
      quantity = -quantity;
      let transactions = dbUser?.transactions;
      let quantityHeld = 0;
      if (transactions && transactions.length > 0) {
        for (let i = 0; i < transactions.length; i++) {
          let transaction = transactions[i];
          if (stock.toUpperCase() === transaction.stock.toUpperCase()) {
            quantityHeld += transaction.quantity;
          }
        }
      }
      if (quantity > quantityHeld) {
        return res.status(400).json({"message": `${quantityHeld} shares of ${stock} are available to sell`});
      }
      if (cash_balance && dbUser && dbUser.cash_balance) {
        dbUser.cash_balance = cash_balance + (quantity * price);
        const newTrade = new Transaction({
          stock: stock.toUpperCase(),
          price,
          quantity: -quantity,
          user: dbUser,
        });
        await newTrade.save();
        dbUser.transactions.push(newTrade);
        await dbUser.save();
        return res.status(204).send();
      }
  }
  return res.status(400).send();
})

// router.get("/balance", async (req: RequestWithUser, res: Response) => {
//   let polygonClient = new PolygonClient();
//   let user: UserDbInterface | undefined = req.user;

//   let dbUser = await User.findOne({ _id: mongoose.Types.ObjectId(user?.id) })
//     .populate("transactions")
//     .exec();

//   let transactions = dbUser?.transactions;
//   let stocks = new Set();
//   transactions?.forEach(transaction => {
//     stocks.add(transaction.stock.toUpperCase());
//   })
//   let balances: any = {};

//   if (stocks && stocks.size > 0) {
//     try {
//       stocks.forEach(async (stock:string) => {
//         let stockInfo = await polygonClient.getStock(stock);
//         balances[stock] = stockInfo.results[0].close;
//       })
//       return res.json(balances);
//     } catch (err) {
//       console.warn(err);
//       return res.status(404).send();
//     }
//   }
//   return res.status(404).send();
// });

export default router;