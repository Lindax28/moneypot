export default interface StockInterface {
  symbol: string;
  volume: number;
  open: number;
  close: number;
  high: number;
  low: number;
  listdate: string;
  industry: string;
  sector: string;
  country: string;
  marketcap: number;
  employees: number;
  ceo: string;
  url: string;
  description: string;
  exchange: string;
  name: string;
  similar: string[];
}