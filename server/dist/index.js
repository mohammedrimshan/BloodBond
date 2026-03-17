"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const error_middleware_1 = require("./middlewares/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: process.env.CORS_ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    console.log(`⬇️ Incoming Request`);
    console.log(`${req.method} ${req.url}`);
    console.log("Headers:", req.headers["content-type"]);
    console.log("Body:", req.body);
    next();
});
// Health check
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running ✅" });
});
// Error handler
app.use(error_middleware_1.errorHandler);
// Start server
const PORT = process.env.PORT || 5000;
(0, db_1.connectDB)().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});
//# sourceMappingURL=index.js.map