import express from "express";
import { Request, Response } from "express";
import AccessRouter from "./access";
import PrintingRouter from "./printJob";
import UserRouter from "./user";
import FileRouter from "./file";
import PrinterRouter from "./printer";
import ReportRouter from "./report"
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});
router.use("/api/auth", AccessRouter);

router.use("/api/printjob", PrintingRouter);

router.use("/api/user", UserRouter);

router.use("/api/file", FileRouter);

router.use("/api/printer", PrinterRouter);

router.use("/api/report", ReportRouter);

export default router;
