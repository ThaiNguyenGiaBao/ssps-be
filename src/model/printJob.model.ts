import db from "../dbs/initDatabase";
import { BadRequestError, NotFoundError } from "../helper/errorRespone";

class PrintingJobModel {
    static async getPrintJob(printJobId: string) {
        const printJob = await db.query("SELECT * FROM printingjob WHERE id = $1", [printJobId]);
        if(printJob.rows.length == 0) throw new NotFoundError("Can not find this printjob!");
        return printJob.rows[0];
    }

    static async getPrintJobByUser({userId, startDate, endDate}: {userId: string, startDate: string, endDate: string}) {
        let query_string = "SELECT * FROM printingjob WHERE userid = '" + userId + "'";
        if(startDate != null) query_string += " AND starttime>='"+ startDate + "'";
        if(endDate != null) query_string += " AND starttime<='"+ endDate + "'";

        const allPrintJob = await db.query(query_string);
        return allPrintJob.rows;
    }

    static async getPrintJobByPrinter({printerId, startDate, endDate}: {printerId: string, startDate: string, endDate: string}) {
        let query_string = "SELECT * FROM printingjob WHERE printerid = '" + printerId + "'";
        if(startDate != null) query_string += " AND starttime >= '"+ startDate + "' ";
        if(endDate != null) query_string += " AND starttime <= '"+ endDate + "' ";

        const allPrintJob = await db.query(query_string);
        return allPrintJob.rows;
    }

    static async getPrintJobByUserAndPrinter({userId, printerId, startDate, endDate}: {userId: string, printerId: string, startDate: string, endDate: string}) {
        let query_string = "SELECT * FROM printingjob WHERE userid = '" + userId + "' AND printerid = '" +  printerId + "'";
        if(startDate != null) query_string += " AND starttime >= '"+ startDate + "' ";
        if(endDate != null) query_string += " AND starttime <= '"+ endDate + "' ";

        const allPrintJob = await db.query(query_string);
        return allPrintJob.rows;
    }

    static async getPrintJobByDuration({startDate, endDate}: {startDate: string, endDate: string}) {
        let query_string = "SELECT * FROM printingjob";
        if(startDate != null) {
            query_string += " WHERE starttime >= '"+ startDate + "' ";
            if(endDate != null) query_string += " AND starttime <= '"+ endDate + "' ";
        }
        else if(endDate != null) query_string += " WHERE starttime <= '"+ endDate + "' ";

        const allPrintJob = await db.query(query_string);
        return allPrintJob.rows;
    }

    static async deletePrintJob(printJobId: string) {
        const DeleteExistPrintJob = await db.query("DELETE FROM printingjob WHERE id = $1", [printJobId]);
    }

    static async updateStatus(printJobId: string, newStatus: string) {
        const upadte = await db.query("UPDATE printingjob SET status = $1 WHERE id = $2", [newStatus, printJobId])
    }
}

export default PrintingJobModel
