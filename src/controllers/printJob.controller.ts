import PrintJobService from "../services/printJob.service";
import UserService from "../services/user.service";
import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import { BadRequestError, ForbiddenError, PaymentRequired } from "../helper/errorRespone";

class PrintJobController {
    
    // Route /createPrintJob 
    static async CreatePrintJob(req: Request, res: Response) {

        console.log("PrintJobController::CreatePrintJob", req.body);
        if(req.user.role == "admin") throw new ForbiddenError("Only accept user");
        
        let printJob = await PrintJobService.savePrintJob({
            printerid:      req.body.printerid,
            userid:         req.user.id, 
            fileid:         req.body.fileid,
            papersize:      req.body.papersize,
            numpage:        req.body.numpage,
            numside:        req.body.numside,
            numcopy:        req.body.numcopy,
            pagepersheet:   req.body.pagepersheet,
            colortype:      req.body.colortype,
            orientation:    req.body.orientation,
            status:         "created"
        });

        const price = await PrintJobService.CalculatePrice({
            papersize:      req.body.papersize,
            colortype:      req.body.colortype,
            numpage:        req.body.numpage,
            numside:        req.body.numside,
            pagepersheet:   req.body.pagepersheet,
            numcopy:        req.body.numcopy
        });

        return new Created({
            message: "PrintJob created",
            data: {
                "printJob": printJob,
                "price": price
            }
        }).send(res);
    }

    // Route /startPrintJob
    static async StartPrintJob(req: Request, res: Response) {

        console.log("PrintJobController::StartPrintJob", req.body);
        if(req.user.role == "admin") throw new ForbiddenError("Only accept user");

        let printJob = await PrintJobService.getPrintJob(req.body.printJobId);

        // TO-DO: CHECK PERMITTED FILE HERE //

        let userBalance = await UserService.getUserBalance(req.user.id);
        let price = await PrintJobService.CalculatePrice({
            papersize:      printJob.papersize,
            colortype:      printJob.colortype,
            numpage:        printJob.numpage,
            numside:        printJob.numside,
            pagepersheet:   printJob.pagepersheet,
            numcopy:        printJob.numcopy
        });

        if(price > userBalance) {
            await PrintJobService.updateStatus({
                printJobId: req.body.printJobId,
                newStatus: "unpaid"
            });
            throw new PaymentRequired("User does not have enough coin!");
        }

        await UserService.updateUserBalance(req.user.id, userBalance - price);
        await PrintJobService.updateStatus({
            printJobId: req.body.printJobId,
            newStatus: "waiting"
        });

        // send printing request and done task
        // Printfile

        // Dont need await here, in reality, we just send printjob to printer and printer will update printJob status.
        // Our task in this controller is to send request, not to wait for it to be finished.
        PrintJobService.updateStatus({
            printJobId: req.body.printJobId,
            newStatus: "success"
        });

        return new OK({
            message: "Accept printing request",
            data: printJob
        }).send(res);
    }

    // Route /all : Get all history
    static async getAllPrintingHistory(req: Request, res: Response) {
        console.log("PrintJobController::getAllPrintingHistory", req.query);
        if(req.user.role == "user") throw new ForbiddenError("Permission denied on getting history of other user");

        return new OK({
            message: "All history",
            data: await PrintJobService.getPrintingHistoryByUserAndPrinter({
                userId:     "none", 
                printerId:  "none",
                startDate:  req.query.startDate as string,
                endDate:    req.query.endDate as string, 
            })
        }).send(res);
    }

    // Route /user/:userId : Get history of a user
    static async getPrintingHistoryByUser(req: Request, res: Response) {
        
        console.log("PrintJobController::getPrintingHistoryByUser", req.params, req.query);
        if(req.user.role == "user" && req.params.userId != req.user.id) {
            throw new ForbiddenError("Permission denied on getting history of other user");
        }

        return new OK({
            message: "All history printjob of user",
            data: await PrintJobService.getPrintingHistoryByUserAndPrinter({
                userId:     req.params.userId, 
                printerId:  "none",
                startDate:  req.query.startDate as string,
                endDate:    req.query.endDate as string, 
            })
        }).send(res);
    }

    // Route /printer/:printerId : Get history of a printer
    // If user's role is admin, return all printJob of a printer
    // If user's role is user, return all printJob belong to that user of a printer
    static async getPrintingHistoryByPrinter(req: Request, res: Response) {

        console.log("PrintJobController::getPrintingHistoryByPrinter", req.params, req.query);
        let userId = req.user.id;
        if(req.user.role == "admin") userId = "none";

        let result = await PrintJobService.getPrintingHistoryByUserAndPrinter({
            userId:     userId,
            printerId:  req.params.printerId,
            startDate:  req.query.startDate as string,
            endDate:    req.query.endDate as string, 
        });
        
        return new OK({
            message: "All history printjob of printer",
            data: result
        }).send(res);
    }

    static async getPrintJob(req: Request, res: Response) {

        console.log("PrintJobController::getPrintJob", req.params);
        let printJob = await PrintJobService.getPrintJob(req.params.printjobId)
        if(req.user.role == 'user' && req.user.id != printJob.userid) {
            throw new ForbiddenError("Permission denied on getting other user's printJob");
        }

        return new OK({
            message: "PrintJob",
            data: printJob
        }).send(res);
    }

    // Route /totalPage/:userId : Get total page used by a user
    static async getTotalPage(req: Request, res: Response) {
        
        console.log("PrintJobController::getTotalPage", req.params, req.query);
        if(req.user.role == "user" && req.params.userId != req.user.id) {
            throw new ForbiddenError("Permission denied on getting other user's total page");
        }

        return new OK({
            message: "Total printed page of user",
            data: await PrintJobService.CalculateTotalPage({
                userId:     req.params.userId,
                paperSize:  req.query.paperSize as string,
                startDate:  req.query.startDate as string,
                endDate:    req.query.endDate as string, 
            })
        }).send(res);
    }


    // Route /totalUser : Get total user active from startDate to endDate
    static async getTotalUser(req: Request, res: Response) {

        console.log("PrintJobController::getTotalUser", req.params, req.query);
        if(req.user.role != "admin") {
            throw new ForbiddenError("Only admin can get total number of user");
        }

        return new OK({
            message: "Total user",
            data: await PrintJobService.CalculateTotalUser({
                startDate:  req.query.startDate as string,
                endDate:    req.query.endDate as string, 
            })
        }).send(res);
    }
}


export default PrintJobController;
