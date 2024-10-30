import db from "../dbs/initDatabase";
import { BadRequestError, NotFoundError } from "../helper/errorRespone";

class PrintingJobModel {
    static async getPrintJob(printJobId: string) {
        const printJob = await db.query("SELECT * FROM printingjob WHERE id = $1", [printJobId]);
        if (printJob.rows.length == 0) throw new NotFoundError("Can not find this printjob!");
        return printJob.rows[0];
    }

    static async getPrintJobByUserAndPrinter({
        userId,
        printerId,
        startDate,
        endDate
    }: {
        userId: string;
        printerId: string;
        startDate: string;
        endDate: string;
    }) {
        let allPrintJob;

        if (startDate == "") startDate = "0001:01:01T00:00:00";
        if (endDate == "") endDate = "3000:01:01T00:00:00";

        if (printerId == "none" && userId == "none")
            allPrintJob = await db.query(
                "SELECT * FROM printingjob WHERE starttime >= '" + startDate + "' AND starttime <= '" + endDate + "'"
            );
        else if (printerId == "none")
            allPrintJob = await db.query(
                "SELECT * FROM printingjob WHERE userid = $1 AND starttime >= '" + startDate + "' AND starttime <= '" + endDate + "'",
                [userId]
            );
        else if (userId == "none")
            allPrintJob = await db.query(
                "SELECT * FROM printingjob WHERE printerid = $1 AND starttime >=  '" + startDate + "' AND starttime <= '" + endDate + "'",
                [printerId]
            );
        else
            allPrintJob = await db.query(
                "SELECT * FROM printingjob WHERE userid = $1 AND printerid = $2 AND starttime >= '" +
                    startDate +
                    "' AND starttime <= '" +
                    endDate +
                    "'",
                [userId, printerId]
            );

        return allPrintJob.rows;
    }

    static async deletePrintJob(printJobId: string) {
        const DeleteExistPrintJob = await db.query("DELETE FROM printingjob WHERE id = $1", [printJobId]);
    }

    static async updateStatus(printJobId: string, newStatus: string) {
        const upadte = await db.query("UPDATE printingjob SET status = $1 WHERE id = $2", [newStatus, printJobId]);
    }
}

export default PrintingJobModel;
