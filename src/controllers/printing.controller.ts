import PrintingService from "../services/printer.service";
import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";

class PrintingController {
    // static async printFile(req: Request, res: Response) {
    //     console.log("PrintingController::printFile", req.body);
    //     return new OK({
    //         message: "File printed successfully",
    //         data: await PrintingService.printFile()
    //     }).send(res);
    // }
}

export default PrintingController;