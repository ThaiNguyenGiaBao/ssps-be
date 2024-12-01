import { BadRequestError } from "../helper/errorRespone";
import { Payment } from "../model/payment.model";
import PaymentModel from "../model/payment.model";

class PaymentService {
  static async getAllPayment() {
    const result = await PaymentModel.getAllPayment();
    return result;
  }
  static async insertPayment(user_id: string, amount: number) {
    if (!user_id || !amount)
      throw new BadRequestError("user_id and amount must not be null");
    if (amount <= 0)
      throw new BadRequestError("Amount must be larger than 0.");
    const result = await PaymentModel.insertPayment(user_id, amount);
    if (result === null)
      throw new BadRequestError("Failed to insert payment.");
    return result;
  }
}

export default PaymentService;