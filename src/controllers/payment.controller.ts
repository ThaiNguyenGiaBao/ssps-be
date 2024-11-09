import { Request, Response } from "express";
import { OK } from "../helper/successResponse";
import PaymentService from "../services/payment.service";
import UserService from "../services/user.service";
import { console } from "inspector";

class PaymentController {
  static async getAllPayment(req: Request, res: Response) {
    const result = await PaymentService.getAllPayment();
    return new OK({
      data: result,
      message: "Get all payment successfully.",
    }).send(res);
  }
  static async insertPayment(req: Request, res: Response) {
    const userBalance = await UserService.getUserBalance(req.body.user_id);
    const result = await PaymentService.insertPayment(req.body.user_id, req.body.amount);
    const updatedUser = await UserService.updateUserBalance(req.body.user_id, userBalance + req.body.amount);
    return new OK({
      data: {
        user: {
          id: updatedUser.id,
          coinBalance: updatedUser.coinbalance,
        },
        payment: result,
      },
      message: "Insert payment successfully."
    }).send(res);

  }
}

export default PaymentController;