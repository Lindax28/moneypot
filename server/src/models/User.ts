import { UserInterface } from "./../types/user"
import { model, Schema } from "mongoose"

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
    },

    transactions: [{
      type: Schema.Types.ObjectId,
      ref: "Transaction"
    }],
  },
  { timestamps: true }
)

export default model<UserInterface>("User", UserSchema)