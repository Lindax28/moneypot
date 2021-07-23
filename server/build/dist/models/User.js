"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    transactions: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Transaction"
        }],
}, { timestamps: true });
exports.default = mongoose_1.model("User", UserSchema);
//# sourceMappingURL=User.js.map