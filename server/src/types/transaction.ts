import { Document } from "mongoose"

export interface InterfaceTransaction extends Document {
  user_id: number
  stock: string
  price: number
  quantity: number
}