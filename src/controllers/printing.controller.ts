import PrinterService from "../services/printer.service";
import PrintJobService from "../services/printJob.service";
import PrintJobModel from "../model/printJob.model";
import UserService from "../services/user.service";
import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import { BadRequestError, ForbiddenError, PaymentRequired } from "../helper/errorRespone";

class PrintingController {
    static async ShowFile(req: Request, res: Response) {
        if(req.user.role == "admin") throw new ForbiddenError("Only student can view this page!");

        let fileInformation = await PrintJobModel.getAllFile(req.user.id);
        return new OK({
            message: "All files of user",
            data: fileInformation
        }).send(res);
    }

    static async CreatePrintJob(req: Request) {
        req.body.status = "created";
        req.body.userid = req.user.id;
        
        let printJob = await PrintJobModel.savePrintJob(JSON.stringify(req.body))
        console.log(printJob);
        return printJob;
    }

    static async Print(req: Request, res: Response) {
        const printJob = await PrintingController.CreatePrintJob(req);
        const price = await PrintJobService.CalculatePrice(JSON.stringify(req.body));

        return new OK({
            message: "Ready for printing!",
            data: {
                "printJob": printJob,
                "price": price
            }
        }).send(res);
    }

    static async StartPrintJob(req: Request, res: Response) {
        let printJob = await PrintJobModel.getPrintJob(req.body.printJobId);

        if(printJob.status == "success") {
            printJob = await PrintJobModel.clonePrintJob(req.body.printJobId);
            req.body.printJobId = printJob.id;
        }

        // NOT DONE TASK: CHECK PERMITTED FILE HERE //

        let userBalance = await UserService.getUserBalance(req.user.id);
        let price = await PrintJobService.CalculatePrice(JSON.stringify(printJob));
        if(price > userBalance) {
            await PrintJobModel.updateStatus(req.body.printJobId ,"unpaid");
            throw new PaymentRequired("User does not have enough coin!");
        }

        await UserService.updateUserBalance(req.user.id, userBalance - price);
        await PrintJobModel.updateStatus(req.body.printJobId ,"waiting");

        // send printing request and done task
        PrinterService.printFile(req.body.printJobId);

        return new OK({ 
            message: "Accept printing request",
            data: "OK"
        }).send(res);
    }
}


export default PrintingController;