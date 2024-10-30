import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";

import PrintingService from "../services/printer.service";
import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import { Printer } from "../model/printer.model";
import PrinterModel from "../model/printer.model";
class PrinterService {
  static async getAllPrinter(): Promise<Printer[]>{
    const result = await PrinterModel.findAllPrinter();
    return result;
  }

  // static async addPrinter(printer: Printer): Promise<void> {

  // }

  // static async removePrinter(printerId: string) {

  // }

  // static async enablePrinter(printerId: string) {

  // }

  // static async disablePrinter(printerId: string) {

  // }

  // static async updatePrinterDetails(printerId: string, details: Printer): Promise<void> {

  // }

  // static async getPrinterStatus(printerId: string): status {}
}

export default PrinterService;
