import { Document } from "mongoose"

export interface TransactionInterface extends Document {
  user_id: number
  stock: string
  price: number
  quantity: number
}