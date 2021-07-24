import { Document } from "mongoose"

export interface UserInterface extends Document {
  name: string
  email: string
  password: string
  _id: string
}