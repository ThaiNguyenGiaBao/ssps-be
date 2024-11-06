import db from "../dbs/initDatabase";
import { BadRequestError, NotFoundError } from "../helper/errorRespone";

class PrintingJobModel {
    static async getPrintJob(printJobId: string) {
        const printJob = await db.query("SELECT * FROM printingjob WHERE id::text = '" + printJobId + "'");
        if(printJob.rows.length == 0) throw new NotFoundError("Can not find this printjob!");
        return printJob.rows[0];
    }

    static async getPrintJobByUser({userId, startDate, endDate, PageNum, itemPerPage}: 
                                   {userId: string, startDate: string, endDate: string, PageNum: number, itemPerPage: number}) {

        let query_string = "SELECT * FROM printingjob WHERE userid::text = '" + userId + "' ";
        if(startDate != null) query_string += " AND starttime>='"+ startDate + "' ";
        if(endDate != null) query_string += " AND starttime<='"+ endDate + "' ";
        
        query_string += "ORDER BY starttime DESC ";
        if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0) 
            query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();
        
        const allPrintJob = await db.query(query_string);
        return allPrintJob.rows;
    }

    static async getPrintJobByPrinter({printerId, startDate, endDate, PageNum, itemPerPage}: 
                                      {printerId: string, startDate: string, endDate: string, PageNum: number, itemPerPage: number}) {

        let query_string = "SELECT * FROM printingjob WHERE printerid::text = '" + printerId + "' ";
        if(startDate != null) query_string += " AND starttime >= '"+ startDate + "' ";
        if(endDate != null) query_string += " AND starttime <= '"+ endDate + "' ";

        query_string += "ORDER BY starttime DESC ";
        if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0) 
            query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();

        const allPrintJob = await db.query(query_string);
        return allPrintJob.rows;
    }

    static async getPrintJobByUserAndPrinter({userId, printerId, startDate, endDate, PageNum, itemPerPage}: 
                                             {userId: string, printerId: string, startDate: string, endDate: string, PageNum: number, itemPerPage: number}) {

        let query_string = "SELECT * FROM printingjob WHERE userid::text = '" + userId + "' AND printerid::text = '" +  printerId + "' ";
        if(startDate != null) query_string += " AND starttime >= '"+ startDate + "' ";
        if(endDate != null) query_string += " AND starttime <= '"+ endDate + "' ";

        query_string += "ORDER BY starttime DESC ";
        if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0) 
            query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();

        const allPrintJob = await db.query(query_string);
        return allPrintJob.rows;
    }

    static async getPrintJobByDuration({startDate, endDate, PageNum, itemPerPage}: {startDate: string, endDate: string, PageNum: number, itemPerPage: number}) {
        let query_string = "SELECT * FROM printingjob";
        if(startDate != null) {
            query_string += " WHERE starttime >= '"+ startDate + "' ";
            if(endDate != null) query_string += " AND starttime <= '"+ endDate + "' ";
        }
        else if(endDate != null) query_string += " WHERE starttime <= '"+ endDate + "' ";

        query_string += "ORDER BY starttime DESC ";
        if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0) 
            query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();
        
        const allPrintJob = await db.query(query_string);
        return allPrintJob.rows;
    }

    static async deletePrintJob(printJobId: string) {
        const DeleteExistPrintJob = await db.query("DELETE FROM printingjob WHERE id::text = $1", [printJobId]);
    }

    static async updateStatus(printJobId: string, newStatus: string) {
        const upadte = await db.query("UPDATE printingjob SET status = $1 WHERE id = $2", [newStatus, printJobId]);
    }
}

export default PrintingJobModel
