import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from "../helper/errorRespone";

import PrintingService from "../services/printer.service";
import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import { Printer } from "../model/printer.model";
import PrinterModel from "../model/printer.model";
class PrinterService {
  static async getAllPrinter(): Promise<Printer[]> {
    const result: Printer[] = await PrinterModel.findAllPrinter();
    return result;
  }

  static async getPrinterByID(printerID: string): Promise<Printer> {
    const result: Printer | null = await PrinterModel.findPrinterByID(printerID);
    if (result === null) 
      throw new NotFoundError("Cannot find the printer with ID " + printerID)
    return result;
  }

  static async addPrinter(printer:Printer): Promise<Printer> {
    const result = await PrinterModel.createPrinter(printer);
    if (result === null)
      throw new InternalServerError("Cannot create the printer");
    return result;
  }

  static async removePrinter(printerID: string): Promise<Printer> {
    const result = await PrinterModel.deletePrinter(printerID);
    if (result === null)
      throw new NotFoundError("Cannot found the printer to delete");
    return result; 
  }

  static async updatePrinter(printerID: string, data: Partial<Printer>): Promise<Printer> {
    const result = await PrinterModel.updatePrinter(printerID, data);
    if (result === null) 
      throw new NotFoundError("Not found the printer with ID " + printerID);
    return result;
  }
}

export default PrinterService;
