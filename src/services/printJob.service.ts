import PrintJobModel from "../model/printJob.model";
import UserService from "../services/user.service";
import db from "../dbs/initDatabase";
import { BadRequestError, NotFoundError } from "../helper/errorRespone";

class PrintingJobService {
    static async getPrintJob(printJobId: string) {
        if(printJobId == null) throw new BadRequestError("printJobId is null");
        return await PrintJobModel.getPrintJob(printJobId);
    }

    static async updateStatus({printJobId, newStatus}: {printJobId: string, newStatus: string}) {
        if(printJobId == null) throw new BadRequestError("printJobId is null");

        let acceptStatus = new Set(["created", "waiting", "success", "fail", "unpaid"]);
        if(!acceptStatus.has(newStatus)) throw new BadRequestError("Status is not valid");

        await PrintJobModel.updateStatus(printJobId, newStatus);
    }

    static async getPrintingHistoryByUserAndPrinter({userId, printerId, startDate, endDate, PageNum, itemPerPage}: 
                                                    {userId: string, printerId: string, startDate: string, endDate: string, PageNum: number, itemPerPage: number}) {

        if(userId == null) throw new BadRequestError("userId is null");
        if(printerId == null) throw new BadRequestError("printerId is null");

        if(startDate != null && endDate!= null) {
            let checkStartDate = isNaN(Date.parse(startDate));
            let checkEndDate = isNaN(Date.parse(endDate));

            if(checkStartDate || checkEndDate) throw new BadRequestError("Date format is wrong");
        }

        if(!Number.isInteger(PageNum) || PageNum < 0) 
            throw new BadRequestError("Pagination: displayPage is invalid");
        
        if(!Number.isInteger(itemPerPage) || itemPerPage < 0)
            throw new BadRequestError("Pagination: itemPerPage is invalid");

        let result;
        if(userId != "none") await UserService.getUser(userId); // Check if user's exist
        if(userId != "none" && printerId != "none") {
            result = await PrintJobModel.getPrintJobByUserAndPrinter({
                userId:     userId, 
                printerId:  printerId, 
                startDate:  startDate, 
                endDate:    endDate,
                PageNum:    PageNum,
                itemPerPage: itemPerPage
            });
        }
        else if(userId != "none") {
            result = await PrintJobModel.getPrintJobByUser({
                userId:     userId, 
                startDate:  startDate, 
                endDate:    endDate,
                PageNum:    PageNum,
                itemPerPage: itemPerPage
            });
        }
        else if(printerId != "none") {
            result = await PrintJobModel.getPrintJobByPrinter({
                printerId:  printerId, 
                startDate:  startDate, 
                endDate:    endDate,
                PageNum:    PageNum,
                itemPerPage: itemPerPage
            });
        }
        else {
            result = await PrintJobModel.getPrintJobByDuration({
                startDate:  startDate, 
                endDate:    endDate,
                PageNum:    PageNum,
                itemPerPage: itemPerPage
            });
        }

        let numItem = result.length;
        let totalPage = Math.ceil(numItem / itemPerPage);
        
        for (let i in result) {
            let printJob = result[i];
            let price = await PrintingJobService.CalculatePrice({
                papersize: printJob.papersize,
                colortype: printJob.colortype,
                numpage: printJob.numpage,
                numside: printJob.numside,
                pagepersheet: printJob.pagepersheet,
                numcopy: printJob.numcopy
            });
        }

        return {
            printjob: result,
            totalItem: numItem,
            totalPage: totalPage
        }
    }

    static async savePrintJob({printerid, userid, fileid, papersize, numpage, numside, numcopy, pagepersheet, colortype, orientation, status}:
        {
            printerid: string,
            userid: string, 
            fileid: string,
            papersize: string,
            numpage: number,
            numside: number,
            numcopy: number,
            pagepersheet: number,
            colortype: string,
            orientation: string,
            status: string
        }) {

        if (printerid == null || printerid == null || fileid == null ||
            papersize == null || numpage <= 0 || numpage == null || (numside!=1 && numside!=2) ||
            numcopy <= 0 || numcopy == null || pagepersheet <= 0 || pagepersheet == null ||
            colortype == null || orientation == null || status == null
        ) throw new BadRequestError("Invalid parameter for saving printJob");

        const File = await db.query("SELECT * FROM file WHERE id::text = $1", [fileid]);
        if(File.rows.length == 0) {
            throw new NotFoundError("File is not exist");
        }

        await UserService.getUser(userid); // Check if user's exist

        // TO-DO check if printer is not exist -> wait for printer service

        const DeleteExistPrintJob = await db.query("DELETE FROM printingjob WHERE fileid::text = $1 AND status = 'created'", [fileid]);
        const newPrintjob = await db.query("INSERT INTO printingjob (printerid, userid, fileid, papersize, numpage, numside, numcopy, \
            pagepersheet, colortype, orientation, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", [
            printerid,
            userid,
            fileid,
            papersize,
            numpage,
            numside,
            numcopy,
            pagepersheet,
            colortype,
            orientation, 
            status
        ]);
    
        return newPrintjob.rows[0];
    }

    static async CalculatePrice( {papersize, colortype, numpage, numside, pagepersheet, numcopy}:
                                 {papersize: string, colortype: string, numpage: number,
                                 numside: number, pagepersheet: number, numcopy: number}) {
        
        if (papersize == null || numpage <= 0 || numpage == null || (numside!=1 && numside!=2) ||
            numcopy <= 0 || numcopy == null || pagepersheet <= 0 || pagepersheet == null ||
            colortype == null
        ) throw new BadRequestError("Invalid parameter for CalculatePrice");
        
        let base_coin = 1;
        if (papersize == "A5") base_coin = 1;
        else if (papersize == "A4") base_coin = 2;
        else if (papersize == "A3") base_coin = 4;
        else if (papersize == "A2") base_coin = 8;
        else if (papersize == "A1") base_coin = 16;
        else throw new BadRequestError("Invalid paper size (A1-A5 only)!");

        let color_price = 1;
        if (colortype.toLowerCase() != "grayscale") color_price = 2;

        return Math.ceil(numpage / (numside * pagepersheet)) * numcopy * base_coin * color_price;
    }

    static async CalculateTotalPage({userId, paperSize, startDate, endDate} : 
                                  {userId: string, paperSize: string, startDate: string, endDate: string}) {

        if (userId == null) throw new BadRequestError("Invalid parameter for CalculateTotalPage");

        if(startDate != null && endDate!= null) {
            let checkStartDate = isNaN(Date.parse(startDate));
            let checkEndDate = isNaN(Date.parse(endDate));

            if(checkStartDate || checkEndDate) throw new BadRequestError("Date format is wrong");
        }

        await UserService.getUser(userId); // Check if user's exist

        let allPrintjob = await PrintJobModel.getPrintJobByUser({
            userId: userId, 
            startDate: startDate, 
            endDate: endDate,
            PageNum: 0,
            itemPerPage: 10
        });

        let total_page = 0;
        for (let i in allPrintjob) {
            let printJob = allPrintjob[i];
            if (printJob.status != "success") continue;
            if (printJob.papersize != paperSize && paperSize != null) continue;
            total_page += Math.ceil(printJob.numpage / (printJob.numside * printJob.pagepersheet)) * printJob.numcopy;
        }

        return total_page;
    }

    static async CalculateTotalUser({startDate, endDate}: {startDate: string, endDate: string}) {

        if(startDate != null && endDate!= null) {
            let checkStartDate = isNaN(Date.parse(startDate));
            let checkEndDate = isNaN(Date.parse(endDate));

            if(checkStartDate || checkEndDate) throw new BadRequestError("Date format is wrong");
        }

        let allPrintjob = await PrintJobModel.getPrintJobByDuration({
            startDate: startDate,
            endDate: endDate,
            PageNum: 0,
            itemPerPage: 100
        });

        let user = new Set();
        for (let i in allPrintjob) user.add(allPrintjob[i].userid);
        return user.size;
    }
}

export default PrintingJobService;
