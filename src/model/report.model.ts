import exp from "constants";
import db from "../dbs/initDatabase";
import { BadRequestError, NotFoundError } from "../helper/errorRespone";

class ReportModel {
    static async saveReport({name, type, description}: 
                            {name: string, type: string, description: string}) {
            
        const newReport = await db.query("INSERT INTO report (name, type, description) VALUES ($1, $2, $3) RETURNING *", [
            name,
            type,
            description
        ]);

        return newReport.rows[0];
    }

    static async saveReportEventR({reportId, eventId}: {reportId: string, eventId: string}) {
        const newReportEvent = await db.query("INSERT INTO reporteventr (reportid, eventid) VALUES ($1, $2) RETURNING *", [
            reportId,
            eventId
        ]);

        return newReportEvent.rows[0];
    }

    static async saveEvent({userId, type, description}: {userId: string, type: string, description: string}) {
        const newEvent = await db.query("INSERT INTO event (userid, type, description) VALUES ($1, $2, $3) RETURNING *", [
            userId,
            type,
            description
        ]);

        return newEvent.rows[0];
    }

    static async getEventByTime({startDate, endDate}: {startDate: string, endDate: string}) {
        const allEvent = await db.query("SELECT * FROM event WHERE createtime >= '" + startDate + "'" + " AND createtime <= '" +  endDate +"'" );
        return allEvent.rows;
    }

    static async getReportByTime({startDate, endDate}: {startDate: string, endDate: string}) {
        let query_string = "SELECT * FROM report";
        if(startDate != null) {
            query_string += " WHERE createtime >= '"+ startDate + "' ";
            if(endDate != null) query_string += " AND createtime <= '"+ endDate + "' ";
        }
        else if(endDate != null) query_string += " WHERE createtime <= '"+ endDate + "' ";

        const allReport = await db.query(query_string);
        return allReport.rows;
    }

    static async getReportById(reportId: string) {
        let report = await db.query("SELECT * FROM report WHERE id::text = $1", [reportId]);
        if(report.rows.length == 0) throw new NotFoundError("Report not found");
        return report.rows[0];
    }

    static async getEventByReportId(reportId: string) {
        let events =  await db.query("SELECT eventid, userid, createtime, type, description FROM reporteventr JOIN event ON reporteventr.eventid = event.id WHERE reportid = $1", [reportId]);
        return events.rows;
    }

    static async updateReportName(reportId: string, newName: string) {
        let res = await db.query("UPDATE report SET name = $1 WHERE id = $2", [newName, reportId]);
        return res;
    }

    static async updateReportDescription(reportId: string, newDes: string) {
        return await db.query("UPDATE report SET description = $1 WHERE id = $2", [newDes, reportId]);
    }

    static async deleteReportEventById(reportId: string) {
        let result = await db.query("DELETE FROM reporteventr WHERE reportid = $1 RETURNING *", [reportId]);
        return result.rows;
    }

    static async deleteReportById(reportId: string) {
        let result = await db.query("DELETE FROM report WHERE id = $1 RETURNING *", [reportId]);
        return result.rows;
    }
}

export default ReportModel;