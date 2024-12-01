import db from "../dbs/initDatabase";
import { BadRequestError, NotFoundError } from "../helper/errorRespone";

class PrintingJobModel {
    static async getPrintJob(printJobId: string) {
        const printJob = await db.query("SELECT printingjob.id, printingjob.printerid, printingjob.userid, printingjob.fileid, printingjob.starttime, printingjob.papersize, printingjob.numpage, \
                                printingjob.numside, printingjob.numcopy, printingjob.pagepersheet, printingjob.colortype, printingjob.orientation, printingjob.status, users.name AS username, \
                                users.email AS useremail, printer.brand AS printerbrand, printer.model AS printermodel, file.filename, file.url AS fileurl, file.type as filetype \
                                FROM printingjob \
                                INNER JOIN users ON printingjob.userid = users.id \
                                INNER JOIN printer ON printingjob.printerid = printer.id \
                                INNER JOIN file ON printingjob.fileid = file.id \
                                WHERE printingjob.id::text = '" + printJobId + "'");

        if(printJob.rows.length == 0) throw new NotFoundError("Can not find this printjob!");
        return printJob.rows[0];
    }

    static async getPrintJobByUser({userId, startDate, endDate, PageNum, itemPerPage}: 
                                   {userId: string, startDate: string, endDate: string, PageNum: number, itemPerPage: number}) {

        let query_string = "SELECT printingjob.id, printingjob.printerid, printingjob.userid, printingjob.fileid, printingjob.starttime, printingjob.papersize, printingjob.numpage, \
                                printingjob.numside, printingjob.numcopy, printingjob.pagepersheet, printingjob.colortype, printingjob.orientation, printingjob.status, users.name AS username, \
                                users.email AS useremail, printer.brand AS printerbrand, printer.model AS printermodel, file.filename, file.url AS fileurl, file.type as filetype \
                                FROM printingjob \
                                INNER JOIN users ON printingjob.userid = users.id \
                                INNER JOIN printer ON printingjob.printerid = printer.id \
                                INNER JOIN file ON printingjob.fileid = file.id \
                                WHERE printingjob.userid::text = '" + userId + "' ";

        if(startDate != null) query_string += " AND printingjob.starttime>='"+ startDate + "' ";
        if(endDate != null) query_string += " AND printingjob.starttime<='"+ endDate + "' ";
        
        query_string += "ORDER BY printingjob.starttime DESC ";
        // if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0) 
        //     query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();
        
        const allPrintJob = await db.query(query_string);
        return allPrintJob.rows;
    }

    static async getPrintJobByPrinter({printerId, startDate, endDate, PageNum, itemPerPage}: 
                                      {printerId: string, startDate: string, endDate: string, PageNum: number, itemPerPage: number}) {

        let query_string = "SELECT printingjob.id, printingjob.printerid, printingjob.userid, printingjob.fileid, printingjob.starttime, printingjob.papersize, printingjob.numpage, \
                                printingjob.numside, printingjob.numcopy, printingjob.pagepersheet, printingjob.colortype, printingjob.orientation, printingjob.status, users.name AS username, \
                                users.email AS useremail, printer.brand AS printerbrand, printer.model AS printermodel, file.filename, file.url AS fileurl, file.type as filetype \
                                FROM printingjob \
                                INNER JOIN users ON printingjob.userid = users.id \
                                INNER JOIN printer ON printingjob.printerid = printer.id \
                                INNER JOIN file ON printingjob.fileid = file.id \
                                WHERE printingjob.printerid::text = '" + printerId + "' ";

        if(startDate != null) query_string += " AND starttime >= '"+ startDate + "' ";
        if(endDate != null) query_string += " AND starttime <= '"+ endDate + "' ";

        query_string += "ORDER BY starttime DESC ";
        // if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0) 
        //     query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();

        const allPrintJob = await db.query(query_string);
        return allPrintJob.rows;
    }

    static async getPrintJobByUserAndPrinter({userId, printerId, startDate, endDate, PageNum, itemPerPage}: 
                                             {userId: string, printerId: string, startDate: string, endDate: string, PageNum: number, itemPerPage: number}) {

        let query_string = "SELECT printingjob.id, printingjob.printerid, printingjob.userid, printingjob.fileid, printingjob.starttime, printingjob.papersize, printingjob.numpage, \
                                printingjob.numside, printingjob.numcopy, printingjob.pagepersheet, printingjob.colortype, printingjob.orientation, printingjob.status, users.name AS username, \
                                users.email AS useremail, printer.brand AS printerbrand, printer.model AS printermodel, file.filename, file.url AS fileurl, file.type as filetype \
                                FROM printingjob \
                                INNER JOIN users ON printingjob.userid = users.id \
                                INNER JOIN printer ON printingjob.printerid = printer.id \
                                INNER JOIN file ON printingjob.fileid = file.id \
                                WHERE printingjob.userid::text = '" + userId + "' AND printerid::text = '" +  printerId + "' ";

        if(startDate != null) query_string += " AND starttime >= '"+ startDate + "' ";
        if(endDate != null) query_string += " AND starttime <= '"+ endDate + "' ";

        query_string += "ORDER BY starttime DESC ";
        // if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0) 
        //     query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();

        const allPrintJob = await db.query(query_string);
        return allPrintJob.rows;
    }

    static async getPrintJobByDuration({startDate, endDate, PageNum, itemPerPage}: {startDate: string, endDate: string, PageNum: number, itemPerPage: number}) {
        let query_string = "SELECT printingjob.id, printingjob.printerid, printingjob.userid, printingjob.fileid, printingjob.starttime, printingjob.papersize, printingjob.numpage, \
                                printingjob.numside, printingjob.numcopy, printingjob.pagepersheet, printingjob.colortype, printingjob.orientation, printingjob.status, users.name AS username, \
                                users.email AS useremail, printer.brand AS printerbrand, printer.model AS printermodel, file.filename, file.url AS fileurl, file.type as filetype \
                                FROM printingjob \
                                INNER JOIN users ON printingjob.userid = users.id \
                                INNER JOIN printer ON printingjob.printerid = printer.id \
                                INNER JOIN file ON printingjob.fileid = file.id ";

        if(startDate != null) {
            query_string += " WHERE printingjob.starttime >= '"+ startDate + "' ";
            if(endDate != null) query_string += " AND printingjob.starttime <= '"+ endDate + "' ";
        }
        else if(endDate != null) query_string += " WHERE printingjob.starttime <= '"+ endDate + "' ";

        query_string += "ORDER BY printingjob.starttime DESC ";
        // if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0) 
        //     query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();
        
        const allPrintJob = await db.query(query_string);
        return allPrintJob.rows;
    }

    static async getPrintJobType({startDate, endDate}: {startDate: string, endDate: string}) {
        let query_string = "SELECT DISTINCT file.id, type FROM file INNER JOIN printingjob ON file.id = printingjob.fileid ";
        if(startDate != null) {
            query_string += " WHERE starttime >= '"+ startDate + "' ";
            if(endDate != null) query_string += " AND starttime <= '"+ endDate + "' ";
        }
        else if(endDate != null) query_string += " WHERE starttime <= '"+ endDate + "' ";

        // query_string += "ORDER BY starttime DESC ";
        // if(Number.isInteger(PageNum) && PageNum > 0 && Number.isInteger(itemPerPage) && itemPerPage > 0) 
        //     query_string += "LIMIT " + itemPerPage.toString() + " OFFSET " + (itemPerPage * (PageNum - 1)).toString();
        
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
