import ReportService from "../services/report.service"
import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import { BadRequestError, ForbiddenError, PaymentRequired } from "../helper/errorRespone";

class ReportController {
    static async generateMonthlyReport(req: Request, res: Response) {
        if(req.user.role != "admin") throw new ForbiddenError("Only admin can generate Report");
        console.log("Report::generateMonthlyReport", req.body);
        return new Created({
            message: "Report created",
            data: await ReportService.createReport({
                name: req.body.name as string,
                type: req.body.type as string,
                description: req.body.description as string,
                reportDate: req.body.reportDate as string
            })
        }).send(res);
    }

    static async generateYearlyReport(req: Request, res: Response) {
        if(req.user.role != "admin") throw new ForbiddenError("Only admin can generate Report");
        console.log("Report::generateYearlyReport", req.body);
        return new Created({
            message: "Report created",
            data: await ReportService.createReport({
                name: req.body.name as string,
                type: req.body.type as string,
                description: req.body.description as string,
                reportDate: req.body.reportDate as string
            })
        }).send(res);
    }

    static async addEvent(req: Request, res: Response) {
        console.log("Report::addEvent ", req.body);
        return new Created({
            message: "Event created",
            data: await ReportService.createEvent({
                userId: req.user.id,
                type: req.body.type,
                description: req.body.description
            })
        }).send(res);
    }

    static async getAllReport(req: Request, res: Response) {
        if(req.user.role != "admin") throw new ForbiddenError("Only admin can get report");
        console.log("Report::getAllReport ", req.query);
        return new OK({
            message: "All report",
            data: await ReportService.getReportByTime({
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string
            })
        }).send(res);
    }

    static async getReportById(req: Request, res: Response) {
        if(req.user.role != "admin") throw new ForbiddenError("Only admin can get report");
        console.log("Report::getReportById ", req.params);
        return new OK({
            message: "Report and all events of the report",
            data: await ReportService.getReportEventById({reportId: req.params.reportId})
        }).send(res);
    }

    static async updateReport(req: Request, res: Response) {
        if(req.user.role != "admin") throw new ForbiddenError("Only admin can update report");
        console.log("Report::updateReport ", req.params, req.body);
        return new OK({
            message: "Update report successfully",
            data: await ReportService.updateReport({
                reportId: req.params.reportId as string,
                newName: req.body.name as string,
                newDes: req.body.description as string
            })
        }).send(res);
    }

    static async deleteReport(req: Request, res: Response) {
        if(req.user.role != "admin") throw new ForbiddenError("Only admin can delete report");
        console.log("Report::deleteReport ", req.params);
        return new OK({
            message: "Delete report successfully",
            data: await ReportService.deleteReport(req.params.reportId)
        }).send(res);
    }

    static async deleteEvent(req: Request, res: Response) {

    }

    static async updateEvent(req: Request, res: Response) {
        
    }
}

export default ReportController;