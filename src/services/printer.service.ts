import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";
import PrintJobModel from "../model/printJob.model";

class PrintingService{
    static printFile(printJobId: string) {

        // process
        // sucess:
        PrintJobModel.updateStatus(printJobId, "success");

        return {
            data: "File data"
        }
    }
}

export default PrintingService;