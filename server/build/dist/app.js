"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var morgan_1 = __importDefault(require("morgan"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = __importDefault(require("passport-local"));
var express_session_1 = __importDefault(require("express-session"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var dotenv_1 = __importDefault(require("dotenv"));
var User_1 = __importDefault(require("./models/User"));
var stocks_1 = __importDefault(require("./routes/stocks"));
var session_1 = __importDefault(require("./routes/session"));
var portfolio_1 = __importDefault(require("./routes/portfolio"));
dotenv_1.default.config();
mongoose_1.default.connect("mongodb+srv://dev:" + process.env.MONGO_PASSWORD + "@moneypot.euzhx.mongodb.net/Moneypot?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err)
        throw err;
    console.log("Connected to Mongo");
});
// Middleware
var app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default({ origin: process.env.BASE_URL, credentials: true }));
app.use(express_session_1.default({
    secret: "password",
    resave: true,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(morgan_1.default("combined"));
// Passport
var LocalStrategy = passport_local_1.default.Strategy;
passport_1.default.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, function (email, password, done) {
    User_1.default.findOne({ email: email }, function (err, user) {
        console.log(err, user);
        if (err)
            throw err;
        if (!user)
            return done(null, false);
        bcryptjs_1.default.compare(password, user.password, function (err, result) {
            if (err)
                throw err;
            if (result === true) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    });
}));
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user.id);
});
passport_1.default.deserializeUser(function (id, cb) {
    User_1.default.findOne({ _id: id }, function (err, user) {
        var userInformation = {
            email: user.email,
            id: user.id
        };
        cb(err, userInformation);
    });
});
// Routes
app.use("/api/stocks", stocks_1.default);
app.use("/api/portfolio", portfolio_1.default);
app.use("", session_1.default);
var path = require('path');
// load static build folder in production
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static("../client/build"));
    app.get("*", function (req, res) {
        res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
    });
}
app.listen(3000, function () {
    console.log("Server started");
});
//# sourceMappingURL=app.js.map