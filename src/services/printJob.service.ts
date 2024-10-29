import PrintJobModel from "../model/printJob.model"
import UserService from "../services/user.service"

class PrintingJobService {
    static async CalculatePrice(cfgJSON: string) {
        let cfg = JSON.parse(cfgJSON);
        let base_coin = 1;
        if(cfg.papersize == 'A4') base_coin = 2;
        if(cfg.papersize == 'A3') base_coin = 4;
        if(cfg.papersize == 'A2') base_coin = 8;
        if(cfg.papersize == 'A1') base_coin = 16;

        let color_price = 1;
        if(cfg.colortype != 'Grayscale') color_price = 2;

        return Math.ceil(cfg.numpage / (cfg.numside * cfg.pagepersheet)) * cfg.numcopy * base_coin * color_price;
    }

    static async CalculatePage(cfgJSON: string) {
        let cfg = JSON.parse(cfgJSON);
        return Math.ceil(cfg.numpage / (cfg.numside * cfg.pagepersheet)) * cfg.numcopy;
    }
}

export default PrintingJobService;