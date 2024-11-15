import express from "express";
import { asyncHandler } from "../../utils";
import { authenticateToken } from "../../middlewares/auth.middlewares";
import PaymentController from "../../controllers/payment.controller";
const router = express.Router();

router.use(asyncHandler(authenticateToken));
router.get("/", asyncHandler(PaymentController.getAllPayment));
router.get("/:user_id", asyncHandler(PaymentController.getPaymentByUserID))
router.post("", asyncHandler(PaymentController.insertPayment));

export default router;