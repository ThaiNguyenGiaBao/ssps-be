"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_1 = __importDefault(require("./access"));
const printing_1 = __importDefault(require("./printing"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});
router.use("/api/auth", access_1.default);
router.use("/api/printing", printing_1.default);
exports.default = router;
