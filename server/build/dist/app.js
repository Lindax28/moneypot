"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("mongodb+srv://dev:i2NRitD0NFDTt2Lr@moneypot.euzhx.mongodb.net/Moneypot?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err)
        throw err;
    console.log("Connected to Mongo");
});
//# sourceMappingURL=app.js.map