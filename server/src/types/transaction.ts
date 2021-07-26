import { Document } from "mongoose"

export interface TransactionDbInterface extends Document {
  _id: string;
  user_id: number;
  stock: string;
  price: number;
  quantity: number;
}