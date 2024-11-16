"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initDatabase_1 = __importDefault(require("../dbs/initDatabase"));
class PaymentModel {
    static getAllPayment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ offset, limit }) {
            const result = yield initDatabase_1.default.query(`
      SELECT * FROM PAYMENT
      LIMIT $1 OFFSET $2;`, [limit, offset]);
            return result.rows;
        });
    }
    static insertPayment(user_id, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield initDatabase_1.default.query(`
      INSERT INTO payment(user_id, amount)
      VALUES ($1, $2)
      RETURNING *;`, [user_id, amount]);
            return result.rows[0] || null;
        });
    }
    static getPaymentByUserID(user_id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (user_id, { offset, limit }) {
            const result = yield initDatabase_1.default.query(`
      SELECT *
      FROM PAYMENT 
      WHERE user_id=$1
      LIMIT $2 OFFSET $3;`, [user_id, limit, offset]);
            return result.rows;
        });
    }
}
exports.default = PaymentModel;
