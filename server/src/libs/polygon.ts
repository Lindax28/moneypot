import { restClient } from "@polygon.io/client-js";

export default class PolygonClient {
  rest = restClient(process.env.POLYGON_API_KEY);
  constructor() {
  }

  async getStock(symbol: string) {
    return await this.rest.stocks.previousClose(symbol);
  }

  async getCompany(symbol: string) {
    return await this.rest.reference.tickerDetails(symbol);
  }
}
