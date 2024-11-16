import db from "../dbs/initDatabase";
import ReportModel from "../model/report.model"
import UserService from "./user.service";
import { BadRequestError, NotFoundError } from "../helper/errorRespone";

class ReportService {
    static async createReport({name, type, description, reportDate}: 
                            {name: string, type: string, description: string, reportDate: string}) {
                                
        if(name == null) throw new BadRequestError("Name is null (generating report)");
        if(type == null) throw new BadRequestError("Type is null (generating report)");

        let checkDate = isNaN(Date.parse(reportDate));
        if(checkDate) throw new BadRequestError("Date format is wrong (generating report)");
        
        const newReport = await ReportModel.saveReport({
            name: name,
            type: type,
            description: description
        });

        const newReportId = newReport.id;
        const date = new Date(reportDate);
        let startDate = reportDate;
        let endDate = reportDate;

        if(type == "monthly") {
            startDate = (new Date(date.getFullYear(), date.getMonth(), 1, 0 + 7)).toISOString();
            endDate = (new Date(date.getFullYear(), date.getMonth()+1, 0, 24 + 7)).toISOString();
        }
        else if(type == "yearly") {
            startDate = (new Date(date.getFullYear(), 0, 1, 0 + 7)).toISOString();
            endDate = (new Date(date.getFullYear(), 12, 0, 24 + 7)).toISOString();
        }
        else throw new BadRequestError("Invalid type (generating report)");

        const allEvent = await ReportModel.getEventByTime({
            startDate: startDate,
            endDate: endDate
        });

        for(let i in allEvent) {
            const newReportEvent = await ReportModel.saveReportEventR({reportId: newReportId, eventId: allEvent[i].id});
        }

        return {newReport: newReport, allEvent: allEvent};
    }

    static async createEvent({userId, type, description}: {userId: string, type: string, description: string}) {
        if(userId == null) throw new BadRequestError("userId is null (creating report)");
        if(type == null) throw new BadRequestError("Type is null (creating report)");

        let user = await UserService.getUser(userId);

        let newEvent = await ReportModel.saveEvent({
            userId: userId,
            type: type,
            description: description
        })

        return newEvent;
    }

    static async getReportByTime({startDate, endDate}: {startDate: string, endDate: string}) {
        if(startDate != null && endDate!= null) {
            let checkStartDate = isNaN(Date.parse(startDate));
            let checkEndDate = isNaN(Date.parse(endDate));

            if(checkStartDate || checkEndDate) throw new BadRequestError("Date format is wrong");
        }

        return await ReportModel.getReportByTime({
            startDate: startDate,
            endDate: endDate
        });
    }

    static async getReportEventById({reportId}: {reportId: string}) {
        if(reportId == null) throw new BadRequestError("ReportId is null");
        return {
            report: await ReportModel.getReportById(reportId),
            event: await ReportModel.getEventByReportId(reportId)
        }
    }

    static async updateReport({reportId, newName, newDes}: {reportId: string, newName: string, newDes: string}) {
        if(reportId == null) throw new BadRequestError("ReportId is null");
        if(newName!=null) await ReportModel.updateReportName(reportId, newName);
        if(newDes!=null) await ReportModel.updateReportDescription(reportId, newDes);
        return await ReportModel.getReportById(reportId);
    }

    static async deleteReport(reportId: string) {
        if(reportId == null) throw new BadRequestError("ReportId is null");

        let deletedEvent = await ReportModel.deleteReportEventById(reportId);
        let deletedReport = await ReportModel.deleteReportById(reportId);

        return {deletedReport: deletedReport, deletedEvents: deletedEvent};
    }
}

export default ReportService;