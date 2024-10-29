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
class AccessModel {
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield initDatabase_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
            //console.log(user);
            return user.rows[0];
        });
    }
    static createUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, username, hashedPassword, avatarUrl }) {
            const newUserResult = yield initDatabase_1.default.query(`INSERT INTO users (email, name, password, avatarUrl) 
             VALUES ($1, $2, $3, $4) RETURNING *`, [email, username, hashedPassword, avatarUrl]);
            return newUserResult.rows[0];
        });
    }
}
exports.default = AccessModel;
