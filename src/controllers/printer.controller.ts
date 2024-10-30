import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import { BadRequestError, ForbiddenError } from "../helper/errorRespone";

import PrinterService from "../services/printer.service";
import { Printer } from "../model/printer.model";
class PrinterController {
  static async getPrinter(req: Request, res: Response) {
    if (req.params.id) {
      const result = await PrinterService.getPrinterByID(req.params.id);
      return new OK({
        data: result,
        message: "Get printer successfully"
      }).send(res);
    }
    else {
      const result = await PrinterService.getAllPrinter();
      return new OK({
        data: result,
        message: result.length === 0? "No printer found" : 
          "Get all printers successfully"
      }).send(res);
    }
  }

  static async addPrinter(req: Request, res: Response) {
    // Check for mandatory attribute
    console.log(req.body)
    if (!req.body.brand)
      throw new BadRequestError("Printer Brand is required");
    if (!req.body.model)
      throw new BadRequestError("Printer Model is required");
    if (!req.body.status)
      throw new BadRequestError("Printer Status is required");

    // Check for invalid type
    if (req.body.status !== "enabled" && req.body.status !== "disabled")
      throw new BadRequestError("Printer status must be enabled or disabled");


    const printer: Printer = {
      id: "dummy",
      brand: req.body.brand,
      model: req.body.model,
      status: req.body.status,
      ...(req.body.locationId && { locationId: req.body.locationId }),
      ...(req.body.shortDescription && { locationId: req.body.shortDescription })
    }
    const result = await PrinterService.addPrinter(printer);
    return new Created({
      message: "Printer added succeessfully",
      data: result
    }).send(res)
  }

  static async removePrinter(req: Request, res: Response) {
    // console.log(req.params.id)
    // console.log(typeof req.params.id)
    const result = await PrinterService.removePrinter(req.params.id);
    return new OK({
      message: "Delete successfully",
      data: result
    }).send(res);
  }

  static async updatePrinter(req: Request, res: Response) {
    const result = await PrinterService.updatePrinter(req.params.id, req.body);
    return new OK({
      message: "Update successfully",
      data: result
    }).send(res);
  }
}

export default PrinterController;