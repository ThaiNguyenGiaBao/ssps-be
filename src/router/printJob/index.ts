import express from "express";
import { asyncHandler } from "../../utils";
import { authenticateToken } from "../../middlewares/auth.middlewares";
import PrintingController from "../../controllers/printJob.controller";

const router = express.Router();

router.use(asyncHandler(authenticateToken));
router.post("/print", asyncHandler(PrintingController.Print));
router.post("/request-printing", asyncHandler(PrintingController.StartPrintJob));
// GET /printjob/user/:userId
router.get("/user/:userId", asyncHandler(PrintingController.getPrintingHistory)); //GetPrintingHistoryByUserId

// GET /printjob/printer/:printerId
router.get("/printer/:printerId", asyncHandler(PrintingController.getPrintingHistory)); //GetPrintingHistoryByPrinterId

// GET /:printJobId
//router.get("/:printJobId", asyncHandler(PrintingController.getPrintJob)); //GetPrintJob


// // GET
// router.get("/totalnumpage/:userId", asyncHandler(PrintingController.getNumberOfPage));



// // GET
// router.get("/totalUser?startDate=string&endDate=string, asyncHandler(PrintingController.getTotalUser));

// GET POST req {id, name, password, ..}, res {user} POST /user {name, password, ..}
// GET req  {id, filename} , res {file, priner} GET /file/:id

export default router;



