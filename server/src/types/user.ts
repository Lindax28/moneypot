import { Document } from "mongoose"

export interface InterfaceUser extends Document {
  name: string
  email: string
  password: string
}