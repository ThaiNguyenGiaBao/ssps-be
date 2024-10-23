"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils");
const printing_controller_1 = __importDefault(require("../../controllers/printing.controller"));
const router = express_1.default.Router();
//router.use(asyncHandler(authenticateToken));
router.post("/print", (0, utils_1.asyncHandler)(printing_controller_1.default.printFile));
exports.default = router;
