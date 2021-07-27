import { Document } from "mongoose"

export default interface TransactionDbInterface extends Document {
  user: number;
  stock: string;
  price: number;
  quantity: number;
}