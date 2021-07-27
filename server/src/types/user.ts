import { Document } from "mongoose";
import TransactionDbInterface from './transaction';

export default interface UserDbInterface extends Document {
  name: string;
  email: string;
  password: string;
  cash_balance: number;
  transactions: TransactionDbInterface[];
}