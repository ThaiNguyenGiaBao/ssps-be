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
const printJob_model_1 = __importDefault(require("../model/printJob.model"));
class PrintJobService {
    static CalculatePrice(cfgJSON) {
        return __awaiter(this, void 0, void 0, function* () {
            let cfg = JSON.parse(cfgJSON);
            let base_coin = 1;
            if (cfg.papersize == 'A4')
                base_coin = 2;
            if (cfg.papersize == 'A3')
                base_coin = 4;
            if (cfg.papersize == 'A2')
                base_coin = 8;
            if (cfg.papersize == 'A1')
                base_coin = 16;
            let color_price = 1;
            if (cfg.colortype != 'Grayscale')
                color_price = 2;
            return Math.ceil(cfg.numpage / (cfg.numside * cfg.pagepersheet)) * cfg.numcopy * base_coin * color_price;
        });
    }
    static CalculatePage(cfgJSON) {
        return __awaiter(this, void 0, void 0, function* () {
            let cfg = JSON.parse(cfgJSON);
            return Math.ceil(cfg.numpage / (cfg.numside * cfg.pagepersheet)) * cfg.numcopy;
        });
    }
    static CalculateNumPage(userID, paperSize, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let allPrintjob = yield printJob_model_1.default.getPrintJobByUserAndPrinter(userID, "none", startTime, endTime, ["success"]);
            let total_page = 0;
            for (let i in allPrintjob) {
                let printJob = allPrintjob[i];
                if (printJob.status != 'success')
                    continue;
                if (printJob.papersize != paperSize && paperSize != "none")
                    continue;
                total_page += Math.ceil(printJob.numpage / (printJob.numside * printJob.pagepersheet)) * printJob.numcopy;
            }
            return total_page;
        });
    }
    static CalculateNumUserPrint(startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let allPrintjob = yield printJob_model_1.default.getPrintJobByUserAndPrinter("none", "none", startTime, endTime, ["success", "unpaid", "fail", "waiting"]);
            let user = new Set();
            for (let i in allPrintjob)
                user.add(allPrintjob[i].userid);
            return user.size;
        });
    }
}
exports.default = PrintJobService;
