import { TransactionDbInterface } from "./../types/transaction"
import { model, Schema } from "mongoose"

const TransactionSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    stock: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

export default model<TransactionDbInterface>("Transaction", TransactionSchema)