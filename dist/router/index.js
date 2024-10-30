"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_1 = __importDefault(require("./access"));
const printJob_1 = __importDefault(require("./printJob"));
const user_1 = __importDefault(require("./user"));
const file_1 = __importDefault(require("./file"));
//import PrinterRouter from "./printer";
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});
router.use("/api/auth", access_1.default);
router.use("/api/printjob", printJob_1.default);
router.use("/api/user", user_1.default);
router.use("/api/file", file_1.default);
//router.use("/api/printer", PrinterRouter);
exports.default = router;
