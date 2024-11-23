import express from "express";
import { Request, Response } from "express";
import AccessRouter from "./access";
import PrintingRouter from "./printJob";
import UserRouter from "./user";
import FileRouter from "./file";
import PrinterRouter from "./printer";
import ConfigRouter from "./config";
import PaymentRouter from "./payment";
import ReportRouter from "./report";
import LocationRouter from "./location"
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});
router.use("/api/auth", AccessRouter);
// /api/auth/signup

router.use("/api/printjob", PrintingRouter);

router.use("/api/user", UserRouter);

router.use("/api/file", FileRouter);

router.use("/api/printer", PrinterRouter);

router.use("/api/config", ConfigRouter);

router.use("/api/payment", PaymentRouter);

router.use("/api/report", ReportRouter);
router.use("/api/location", LocationRouter)
export default router;
