import { Document } from "mongoose"

export interface UserDbInterface extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
}