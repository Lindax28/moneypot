import { restClient } from "@polygon.io/client-js";
const rest = restClient(process.env.POLYGON_API_KEY);

export default class PolygonClient {
  constructor() {}

  async getStock(symbol: string) {
    return await rest.stocks.previousClose(symbol);
  }

  async getCompany(symbol: string) {
    return await rest.reference.tickerDetails(symbol);
  }
}
