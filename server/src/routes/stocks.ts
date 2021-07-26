import express, { Request, Response } from 'express';
import PolygonClient from '../libs/polygon';
import StockInterface from '../types/stock';
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
    return res.status(404).send();
  }
  return res.status(404).send();
})

module.exports = router;