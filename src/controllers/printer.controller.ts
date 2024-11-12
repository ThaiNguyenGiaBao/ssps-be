import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import { BadRequestError, ForbiddenError } from "../helper/errorRespone";

import PrinterService from "../services/printer.service";
import { Printer } from "../model/printer.model";

class PrinterController {
  static async getPrinterByID(req: Request, res: Response) {
    const result = await PrinterService.getPrinterByID(req.params.id);
    return new OK({
      data: result,
      message: "Get printer successfully"
    }).send(res);
  }
  
  static async getAllPrinter(req: Request, res: Response) {
    const result = await PrinterService.getAllPrinter();
    return new OK({
      data: result,
      message: result.length === 0? "No printer found" : 
        "Get all printers successfully"
    }).send(res);
  }

  static async addPrinter(req: Request, res: Response) {
    if(req.user.role != "admin") throw new ForbiddenError("Only admin can add a printer.");
    const printer: Printer = {
      id: "dummy",
      brand: req.body.brand,
      model: req.body.model,
      status: req.body.status,
      locationId: req.body.locationId,
      shortDescription: req.body.shortDescription
    }
    const result = await PrinterService.addPrinter(printer);
    return new Created({
      message: "Printer added succeessfully",
      data: result
    }).send(res)
  }

  static async removePrinter(req: Request, res: Response) {
    if(req.user.role != "admin") throw new ForbiddenError("Only admin can remove a printer.");
    const result = await PrinterService.removePrinter(req.params.id);
    return new OK({
      message: "Delete successfully",
      data: result
    }).send(res);
  }

  static async updatePrinter(req: Request, res: Response) {
    if(req.user.role != "admin") throw new ForbiddenError("Only admin can update a printer.");
    const result = await PrinterService.updatePrinter(req.params.id, req.body);
    return new OK({
      message: "Update successfully",
      data: result
    }).send(res);
  }
}

export default PrinterController;