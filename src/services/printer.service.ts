import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";

class PrintingService{
    static printFile() {
        // logic
        return {
            data: "File data"
        }
    }
}

export default PrintingService;