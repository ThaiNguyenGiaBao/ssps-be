import { Request, Response } from "express";
import { OK } from "../helper/successResponse";
import PaymentService from "../services/payment.service";
import UserService from "../services/user.service";
import { ForbiddenError } from "../helper/errorRespone";

class PaymentController {
  static async getAllPayment(req: Request, res: Response) {
    if(req.user.role != "admin") throw new ForbiddenError("Only admin can get all payment.");

    const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page
    const offset = (page - 1) * limit;

    const result = await PaymentService.getAllPayment({ offset, limit });
    return new OK({
      data: result,
      message: "Get all payment successfully.",
    }).send(res);
  }

  static async insertPayment(req: Request, res: Response) {
    // if(req.user.role != "admin") throw new ForbiddenError("Only admin can insert payment."); ???
    const userBalance = await UserService.getUserBalance(req.body.user_id);
    const result = await PaymentService.insertPayment(req.body.user_id, req.body.amount);
    const updatedUser = await UserService.updateUserBalance(req.body.user_id, userBalance + req.body.amount);
    return new OK({
      data: {
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          coinBalance: updatedUser.coinbalance,
        },
        payment: result,
      },
      message: "Insert payment successfully."
    }).send(res);
  }

  static async getPaymentByUserID(req: Request, res: Response) {
    if(req.user.role != "admin") throw new ForbiddenError("Only admin can get payment by user ID.");

    const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page
    const offset = (page - 1) * limit;

    const result = await PaymentService.getPaymentByUserID(req.body.user_id, { offset, limit });
    return new OK({
      data: result,
      message: "Get payment by user ID successfully."
    })
  }
}

export default PaymentController;