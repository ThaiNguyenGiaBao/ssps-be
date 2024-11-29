import { BadRequestError } from "../helper/errorRespone";
import PaymentModel from "../model/payment.model";
import { isValidTimestamp } from "../utils";

class PaymentService {
  static async getAllPayment({ offset, limit }: {offset: number, limit: number}) {
    const result = await PaymentModel.getAllPayment({ offset, limit });
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

  static async getPaymentByTime(startTime: string | null, endTime: string | null, { offset, limit } : {offset: number, limit: number}) {
    if (startTime && !isValidTimestamp(startTime)) {
      throw new BadRequestError('Invalid startTime format.');
    }
    if (endTime && !isValidTimestamp(endTime)) {
      throw new BadRequestError('Invalid endTime format..');
    }
    if (startTime && endTime) {
      // Convert startTime and endTime to Date objects for comparison
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      // Check if endTime is greater than or equal to startTime
      if (endDate < startDate) {
        throw new BadRequestError('endTime must be greater than or equal to startTime.');
      }
    }
    const result = await PaymentModel.getPaymentByTime(startTime, endTime, { offset, limit });
    return result;
  }

  static async getPaymentByUserID(user_id: string, { offset, limit }: {offset: number, limit: number}) {
    if (!user_id) 
      throw new BadRequestError("User Id cannot be null.");
    const result = await PaymentModel.getPaymentByUserID(user_id, { offset, limit });
    return result;
  }
}

export default PaymentService;