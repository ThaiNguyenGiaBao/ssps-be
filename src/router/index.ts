import express from "express";
import { Request, Response } from "express";
import AccessRouter from "./access";
import PrintingRouter from "./printing"
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});
router.use("/api/auth", AccessRouter);

router.use("/api/printing",PrintingRouter)

export default router;
