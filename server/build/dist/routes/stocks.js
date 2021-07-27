"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Transaction_1 = __importDefault(require("../models/Transaction"));
var polygon_1 = __importDefault(require("../libs/polygon"));
var User_1 = __importDefault(require("../models/User"));
var mongoose_1 = __importDefault(require("mongoose"));
var router = express_1.default.Router();
router.get("/:symbol", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var symbol, polygonClient, stockInfo, companyInfo, details, stock, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                symbol = req.params.symbol;
                polygonClient = new polygon_1.default();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, polygonClient.getStock(symbol.toUpperCase())];
            case 2:
                stockInfo = _b.sent();
                return [4 /*yield*/, polygonClient.getCompany(symbol.toUpperCase())];
            case 3:
                companyInfo = _b.sent();
                if (stockInfo && stockInfo.results.length > 0) {
                    details = stockInfo.results[0];
                    stock = {
                        symbol: details.tickerSymbol,
                        volume: details.volume,
                        open: details.open,
                        close: details.close,
                        high: details.high,
                        low: details.low,
                        listdate: companyInfo.listdate,
                        industry: companyInfo.industry,
                        sector: companyInfo.sector,
                        country: (_a = companyInfo.country) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                        marketcap: companyInfo.marketcap,
                        employees: companyInfo.employees,
                        ceo: companyInfo.ceo,
                        url: companyInfo.url,
                        description: companyInfo.description,
                        exchange: companyInfo.exchange,
                        name: companyInfo.name,
                        similar: companyInfo.similar
                    };
                    return [2 /*return*/, res.json(stock)];
                }
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                console.warn(err_1);
                return [2 /*return*/, res.status(404).send()];
            case 5: return [2 /*return*/, res.status(404).send()];
        }
    });
}); });
router.post("/trade", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, polygonClient, _a, stock, quantity, dbUser, cash_balance, stockInfo, price, newTrade, transactions, quantityHeld, i, transaction, newTrade;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                polygonClient = new polygon_1.default();
                _a = req.body, stock = _a.stock, quantity = _a.quantity;
                return [4 /*yield*/, User_1.default.findOne({ _id: mongoose_1.default.Types.ObjectId(user === null || user === void 0 ? void 0 : user.id) })
                        .populate("transactions").exec()];
            case 1:
                dbUser = _b.sent();
                cash_balance = dbUser === null || dbUser === void 0 ? void 0 : dbUser.cash_balance;
                return [4 /*yield*/, polygonClient.getStock(stock.toUpperCase())];
            case 2:
                stockInfo = _b.sent();
                price = stockInfo.results[0].close;
                if (!(quantity > 0)) return [3 /*break*/, 8];
                if (!(cash_balance && cash_balance > (quantity * price))) return [3 /*break*/, 6];
                if (!(dbUser && dbUser.cash_balance)) return [3 /*break*/, 5];
                dbUser.cash_balance = cash_balance - (quantity * price);
                newTrade = new Transaction_1.default({
                    stock: req.body.stock.toUpperCase(),
                    price: price,
                    quantity: req.body.quantity,
                    user: dbUser,
                });
                return [4 /*yield*/, newTrade.save()];
            case 3:
                _b.sent();
                dbUser.transactions.push(newTrade);
                return [4 /*yield*/, dbUser.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(204).send()];
            case 5: return [3 /*break*/, 7];
            case 6: return [2 /*return*/, res.status(400).json({ "message": "Insufficient funds" })];
            case 7: return [3 /*break*/, 11];
            case 8:
                quantity = -quantity;
                transactions = dbUser === null || dbUser === void 0 ? void 0 : dbUser.transactions;
                quantityHeld = 0;
                if (transactions && transactions.length > 0) {
                    for (i = 0; i < transactions.length; i++) {
                        transaction = transactions[i];
                        if (stock.toUpperCase() === transaction.stock.toUpperCase()) {
                            quantityHeld += transaction.quantity;
                        }
                    }
                }
                if (quantity > quantityHeld) {
                    return [2 /*return*/, res.status(400).json({ "message": quantityHeld + " shares of " + stock + " are available to sell" })];
                }
                if (!(cash_balance && dbUser && dbUser.cash_balance)) return [3 /*break*/, 11];
                dbUser.cash_balance = cash_balance + (quantity * price);
                newTrade = new Transaction_1.default({
                    stock: stock.toUpperCase(),
                    price: price,
                    quantity: -quantity,
                    user: dbUser,
                });
                return [4 /*yield*/, newTrade.save()];
            case 9:
                _b.sent();
                dbUser.transactions.push(newTrade);
                return [4 /*yield*/, dbUser.save()];
            case 10:
                _b.sent();
                return [2 /*return*/, res.status(204).send()];
            case 11: return [2 /*return*/, res.status(400).send()];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=stocks.js.map