import express, { Request, Response } from 'express';
const router = express.Router();
import PolygonClient from '../libs/polygon';

router.get("/:symbol", async (req: Request, res: Response) => {
  let symbol = req.params.symbol;
  let polygonClient = new PolygonClient();
  try {
    let result = await polygonClient.getStock(symbol);
    return res.json(result);
  } catch (err) {console.log(err);}
  return res.status(400).send();
})

module.exports = router;