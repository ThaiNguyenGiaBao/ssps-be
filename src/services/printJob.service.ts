import PrintJobModel from "../model/printJob.model";
import UserService from "../services/user.service";
import FileService from "./file.service";
import db from "../dbs/initDatabase";
import { BadRequestError, NotFoundError } from "../helper/errorRespone";

class PrintingJobService {
    static async checkDate({ startDate, endDate }: { startDate: string; endDate: string }) {
        if (startDate != null && endDate != null) {
            let checkStartDate = isNaN(Date.parse(startDate));
            let checkEndDate = isNaN(Date.parse(endDate));
            if (checkStartDate || checkEndDate) throw new BadRequestError("Date format is wrong");
        }
    }

    static async getPrintJob(printJobId: string) {
        if (printJobId == null) throw new BadRequestError("printJobId is null");
        let printJob = await PrintJobModel.getPrintJob(printJobId);
        printJob.filename = (await FileService.getFileById("none", printJob.fileid)).filename;
        return printJob;
    }

    static async updateStatus({ printJobId, newStatus }: { printJobId: string; newStatus: string }) {
        if (printJobId == null) throw new BadRequestError("printJobId is null");

        let acceptStatus = new Set(["created", "waiting", "success", "fail", "unpaid"]);
        if (!acceptStatus.has(newStatus)) throw new BadRequestError("Status is not valid");

        await PrintJobModel.updateStatus(printJobId, newStatus);
    }

    static async getPrintingHistoryByUserAndPrinter({
        userId,
        printerId,
        startDate,
        endDate,
        PageNum,
        itemPerPage
    }: {
        userId: string;
        printerId: string;
        startDate: string;
        endDate: string;
        PageNum: number;
        itemPerPage: number;
    }) {
        if (userId == null) throw new BadRequestError("userId is null");
        if (printerId == null) throw new BadRequestError("printerId is null");

        this.checkDate({ startDate: startDate, endDate: endDate });

        if (!Number.isInteger(PageNum) || PageNum < 0) throw new BadRequestError("Pagination: displayPage is invalid");

        if (!Number.isInteger(itemPerPage) || itemPerPage < 0) throw new BadRequestError("Pagination: itemPerPage is invalid");

        let result;
        if (userId != "none") await UserService.getUser(userId); // Check if user's exist
        if (userId != "none" && printerId != "none") {
            result = await PrintJobModel.getPrintJobByUserAndPrinter({
                userId: userId,
                printerId: printerId,
                startDate: startDate,
                endDate: endDate,
                PageNum: PageNum,
                itemPerPage: itemPerPage
            });
        } else if (userId != "none") {
            result = await PrintJobModel.getPrintJobByUser({
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                PageNum: PageNum,
                itemPerPage: itemPerPage
            });
        } else if (printerId != "none") {
            result = await PrintJobModel.getPrintJobByPrinter({
                printerId: printerId,
                startDate: startDate,
                endDate: endDate,
                PageNum: PageNum,
                itemPerPage: itemPerPage
            });
        } else {
            result = await PrintJobModel.getPrintJobByDuration({
                startDate: startDate,
                endDate: endDate,
                PageNum: PageNum,
                itemPerPage: itemPerPage
            });
        }

        let numItem = result.length;
        let totalPage = Math.ceil(numItem / itemPerPage);
        result = result.slice((PageNum - 1) * itemPerPage, PageNum * itemPerPage);

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
            result[i].price = price;
            result[i].filename = (await FileService.getFileById("none", printJob.fileid)).filename;
        }

        return {
            printJob: result,
            totalItem: numItem,
            totalPage: totalPage
        };
    }

    static async savePrintJob({
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
    }: {
        printerid: string;
        userid: string;
        fileid: string;
        papersize: string;
        numpage: number;
        numside: number;
        numcopy: number;
        pagepersheet: number;
        colortype: string;
        orientation: string;
        status: string;
    }) {
        if (
            printerid == null ||
            printerid == null ||
            fileid == null ||
            papersize == null ||
            numpage <= 0 ||
            numpage == null ||
            (numside != 1 && numside != 2) ||
            numcopy <= 0 ||
            numcopy == null ||
            pagepersheet <= 0 ||
            pagepersheet == null ||
            colortype == null ||
            orientation == null ||
            status == null
        )
            throw new BadRequestError("Invalid parameter for saving printJob");

        const File = await db.query("SELECT * FROM file WHERE id::text = $1", [fileid]);
        if (File.rows.length == 0) {
            throw new NotFoundError("File is not exist");
        }

        await UserService.getUser(userid); // Check if user's exist

        // TO-DO check if printer is not exist -> wait for printer service

        const DeleteExistPrintJob = await db.query("DELETE FROM printingjob WHERE fileid::text = $1 AND status = 'created'", [fileid]);
        const newPrintjob = await db.query(
            "INSERT INTO printingjob (printerid, userid, fileid, papersize, numpage, numside, numcopy, \
            pagepersheet, colortype, orientation, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
            [printerid, userid, fileid, papersize, numpage, numside, numcopy, pagepersheet, colortype, orientation, status]
        );

        return newPrintjob.rows[0];
    }

    static async CalculatePrice({
        papersize,
        colortype,
        numpage,
        numside,
        pagepersheet,
        numcopy
    }: {
        papersize: string;
        colortype: string;
        numpage: number;
        numside: number;
        pagepersheet: number;
        numcopy: number;
    }) {
        if (
            papersize == null ||
            numpage <= 0 ||
            numpage == null ||
            (numside != 1 && numside != 2) ||
            numcopy <= 0 ||
            numcopy == null ||
            pagepersheet <= 0 ||
            pagepersheet == null ||
            colortype == null
        )
            throw new BadRequestError("Invalid parameter for CalculatePrice");

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

    static async CalculateTotalPage({
        userId,
        paperSize,
        startDate,
        endDate,
        byMonth
    }: {
        userId: string;
        paperSize: string;
        startDate: string;
        endDate: string;
        byMonth: boolean;
    }) {
        if (userId == null) throw new BadRequestError("Invalid parameter for CalculateTotalPage");
        this.checkDate({ startDate: startDate, endDate: endDate });
        if (userId != "none") await UserService.getUser(userId); // Check if user's exist

        let allPrintjob;
        if (userId != "none") {
            allPrintjob = await PrintJobModel.getPrintJobByUser({
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                PageNum: 0,
                itemPerPage: 10
            });
        } else {
            allPrintjob = await PrintJobModel.getPrintJobByDuration({
                startDate: startDate,
                endDate: endDate,
                PageNum: 0,
                itemPerPage: 10
            });
        }

        let total_page = 0;
        let mp = new Map<string, number>();
        for (let i in allPrintjob) {
            let printJob = allPrintjob[i];
            if (printJob.status != "success") continue;
            if (printJob.papersize != paperSize && paperSize != null) continue;
            let page_cnt = Math.ceil(printJob.numpage / (printJob.numside * printJob.pagepersheet)) * printJob.numcopy;
            total_page += page_cnt;
            let month = new Date(printJob.starttime).toISOString().slice(0, 7);
            let cr = mp.get(month);
            mp.set(month, (cr ? cr : 0) + page_cnt);
        }

        if (!byMonth) return total_page;
        else {
            let result = [];
            for (let key of mp.keys()) {
                result.push({
                    month: key,
                    totalPage: mp.get(key)
                });
            }
            return result;
        }
    }

    static async CalculateTotalUser({ startDate, endDate, byMonth }: { startDate: string; endDate: string; byMonth: boolean }) {
        this.checkDate({ startDate: startDate, endDate: endDate });

        let allPrintjob = await PrintJobModel.getPrintJobByDuration({
            startDate: startDate,
            endDate: endDate,
            PageNum: 0,
            itemPerPage: 100
        });

        if (byMonth) {
            let res = [];
            let prv_month = "none";
            let user = new Set();
            for (let i in allPrintjob) {
                let month = new Date(allPrintjob[i].starttime).toISOString().slice(0, 7);
                if (prv_month != month && prv_month != "none") {
                    res.push({ month: prv_month, totalUser: user.size });
                    user = new Set();
                }

                prv_month = month;
                user.add(allPrintjob[i].userid);
            }
            res.push({ month: prv_month, totalUser: user.size });
            return res;
        } else {
            let user = new Set();
            for (let i in allPrintjob) user.add(allPrintjob[i].userid);
            return user.size;
        }
    }

    static async totalFilebyType({ startDate, endDate, types }: { startDate: string; endDate: string; types: string }) {
        this.checkDate({ startDate: startDate, endDate: endDate });

        const type_list = types.split(",");
        let mp = new Map<string, number>();

        for (let i in type_list) mp.set(type_list[i], 0);

        let allPrintjob = await PrintJobModel.getPrintJobType({
            startDate: startDate,
            endDate: endDate
        });

        for (let i in allPrintjob) {
            for (let j in type_list) {
                let file_type = allPrintjob[i].type;
                if (file_type.includes(type_list[j])) {
                    let cr = mp.get(type_list[j]);
                    mp.set(type_list[j], (cr ? cr : 0) + 1);
                }
            }
        }

        let res = [];
        for (let i in type_list) res.push({ type: type_list[i], totalFile: mp.get(type_list[i]) });
        return res;
    }

    static async printerUsageFrequency({ printerId, startDate, endDate }: { printerId: string; startDate: string; endDate: string }) {
        this.checkDate({ startDate: startDate, endDate: endDate });

        let allPrintjob = await PrintJobModel.getPrintJobByPrinter({
            printerId: printerId,
            startDate: startDate,
            endDate: endDate,
            PageNum: 0,
            itemPerPage: 100
        });

        let mp = new Map<string, number>();
        for (let i in allPrintjob) {
            let printJob = allPrintjob[i];
            if (printJob.status != "success") continue;
            let day = new Date(printJob.starttime).toISOString().slice(0, 10);
            let cr = mp.get(day);
            mp.set(day, (cr ? cr : 0) + 1);
        }

        let result = [];
        for (let key of mp.keys()) {
            result.push({
                date: key,
                usageCount: mp.get(key)
            });
        }
        return result;
    }

    static async getFilePrintRequestFrequency({ startDate, endDate }: { startDate: string; endDate: string }) {
        this.checkDate({ startDate: startDate, endDate: endDate });

        let allPrintjob = await PrintJobModel.getPrintJobByDuration({
            startDate: startDate,
            endDate: endDate,
            PageNum: 0,
            itemPerPage: 100
        });

        let mp = new Map<string, number>();
        for (let i in allPrintjob) {
            let day = new Date(allPrintjob[i].starttime).toISOString().slice(0, 10);
            let cr = mp.get(day);
            mp.set(day, (cr ? cr : 0) + 1);
        }

        let result = [];
        for (let key of mp.keys()) {
            result.push({
                date: key,
                filePrintRequests: mp.get(key)
            });
        }
        return result;
    }
}

export default PrintingJobService;
