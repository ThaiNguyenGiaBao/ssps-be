"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils");
const auth_middlewares_1 = require("../../middlewares/auth.middlewares");
const printJob_controller_1 = __importDefault(require("../../controllers/printJob.controller"));
const router = express_1.default.Router();
router.use((0, utils_1.asyncHandler)(auth_middlewares_1.authenticateToken));
router.post("/print", (0, utils_1.asyncHandler)(printJob_controller_1.default.Print));
router.post("/request-printing", (0, utils_1.asyncHandler)(printJob_controller_1.default.StartPrintJob));
// GET /printjob/user/:userId
router.get("/user/:userId", (0, utils_1.asyncHandler)(printJob_controller_1.default.getPrintingHistory)); //GetPrintingHistoryByUserId
// GET /printjob/printer/:printerId
router.get("/printer/:printerId", (0, utils_1.asyncHandler)(printJob_controller_1.default.getPrintingHistory)); //GetPrintingHistoryByPrinterId
// GET /:printJobId
//router.get("/:printJobId", asyncHandler(PrintingController.getPrintJob)); //GetPrintJob
// // GET
// router.get("/totalnumpage/:userId", asyncHandler(PrintingController.getNumberOfPage));
// // GET
// router.get("/totalUser?startDate=string&endDate=string, asyncHandler(PrintingController.getTotalUser));
// GET POST req {id, name, password, ..}, res {user} POST /user {name, password, ..}
// GET req  {id, filename} , res {file, priner} GET /file/:id
exports.default = router;
