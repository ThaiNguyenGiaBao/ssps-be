import db from "../dbs/initDatabase";
import { BadRequestError, NotFoundError } from "../helper/errorRespone";

class PrintingJobModel {
    static async getAllFile(userId: string) {
        const fileResult = await db.query("SELECT * FROM file WHERE userid = $1", [userId]);
        return fileResult.rows
    }
    
    static async savePrintJob(cfgJSON: string) {
        let cfg = JSON.parse(cfgJSON);

        const File = await db.query("SELECT * FROM file WHERE id = $1", [cfg.fileid]);
        if(File.rows.length == 0) {
            throw new NotFoundError("File is not exist");
        }

        const DeleteExistPrintJob = await db.query("DELETE FROM printingjob WHERE fileid = $1 AND status = 'created'", [cfg.fileid]);
        const newPrintjob = await db.query("INSERT INTO printingjob (printerid, userid, fileid, papersize, numpage, numside, numcopy, \
            pagepersheet, colortype, orientation, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", [
            cfg.printerid,
            cfg.userid,
            cfg.fileid,
            cfg.papersize,
            cfg.numpage,
            cfg.numside,
            cfg.numcopy,
            cfg.pagepersheet,
            cfg.colortype,
            cfg.orientation, 
            cfg.status
        ]);
    
        return newPrintjob.rows[0];
    }

    static async getPrintJob(printJobId: string) {
        const printJob = await db.query("SELECT * FROM printingjob WHERE id = $1", [printJobId]);
        if(printJob.rows.length == 0) throw new NotFoundError("Can not find this prinjob!");
        return printJob.rows[0];
    }

    static async updateStatus(printJobId: string, newStatus: string) {
        const upadte = await db.query("UPDATE printingjob SET status = $1 WHERE id = $2", [newStatus, printJobId])
    }

    static async clonePrintJob(printJobId: string) {
        let currentPrintJob = await db.query("SELECT * FROM printingjob WHERE id = $1", [printJobId]);
        if(currentPrintJob.rows.length == 0) throw new NotFoundError('Printjob not found');
        let cfg = currentPrintJob.rows[0];

        const newPrintjob = await db.query("INSERT INTO printingjob (printerid, userid, fileid, papersize, numpage, numside, numcopy, \
            pagepersheet, colortype, orientation, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", [
            cfg.printerid,
            cfg.userid,
            cfg.fileid,
            cfg.papersize,
            cfg.numpage,
            cfg.numside,
            cfg.numcopy,
            cfg.pagepersheet,
            cfg.colortype,
            cfg.orientation, 
            "created"
        ]);
        
        return newPrintjob.rows[0];
    }

}

export default PrintingJobModel