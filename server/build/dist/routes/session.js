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
var User_1 = __importDefault(require("../models/User"));
var passport_1 = __importDefault(require("passport"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var router = express_1.default.Router();
router.post('/register', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password;
    return __generator(this, function (_b) {
        _a = req === null || req === void 0 ? void 0 : req.body, name = _a.name, email = _a.email, password = _a.password;
        if (!name || !email || !password || typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            res.status(400).json({ "message": "Invalid input" });
            return [2 /*return*/];
        }
        User_1.default.findOne({ email: email }, function (err, doc) { return __awaiter(void 0, void 0, void 0, function () {
            var passwordDigest, newUser, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err)
                            throw err;
                        if (doc)
                            res.status(400).json({ "message": "User already exists" });
                        if (!!doc) return [3 /*break*/, 3];
                        return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
                    case 1:
                        passwordDigest = _a.sent();
                        newUser = new User_1.default({
                            name: name,
                            email: email,
                            cash_balance: 10000,
                            password: passwordDigest
                        });
                        return [4 /*yield*/, newUser.save()];
                    case 2:
                        user = _a.sent();
                        console.log(user);
                        passport_1.default.authenticate('local', function (err, user, info) {
                            if (err) {
                                return next(err);
                            }
                            if (!user) {
                                return res.status(400).send();
                            }
                            req.logIn(user, function (err) {
                                if (err) {
                                    return next(err);
                                }
                                return res.status(200).send();
                            });
                        })(req, res, next);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
router.post("/login", passport_1.default.authenticate("local"), function (req, res) {
    var user = req.user;
    return res.json({ id: user === null || user === void 0 ? void 0 : user.id });
});
router.get("/logout", function (req, res) {
    req.logout();
    res.send("success");
});
router.get("/user", function (req, res) {
    return res.json(req.user);
});
exports.default = router;
//# sourceMappingURL=session.js.map