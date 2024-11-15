"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_service_1 = require("../services/config.service");
const successResponse_1 = require("../helper/successResponse");
const errorRespone_1 = require("../helper/errorRespone");
class ConfigController {
    static getConfigSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let permitedFiles = yield config_service_1.ConfigService.getPermitedFile();
            let config = yield config_service_1.ConfigService.getPageConfig();
            return new successResponse_1.OK({
                data: {
                    "permitedFiles": permitedFiles,
                    "config": config
                },
                message: "Get configuration successfully!"
            }).send(res);
        });
    }
    static getPermitedFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield config_service_1.ConfigService.getPermitedFile();
            return new successResponse_1.OK({
                data: result,
                message: "Get permited file types successfully!"
            }).send(res);
        });
    }
    static addPermitedFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can add permitted file type.");
            const result = yield config_service_1.ConfigService.addPermitedFile(req.body);
            return new successResponse_1.OK({
                data: result,
                message: "Add permited file type successfully"
            }).send(res);
        });
    }
    static updatePermitedFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can update permitted file type.");
            const result = yield config_service_1.ConfigService.updatePermitedFile(req.params.type, req.body);
            return new successResponse_1.OK({
                data: result,
                message: "Permited file updated successfully!"
            }).send(res);
        });
    }
    static deletePermitedFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can delete permitted file type.");
            const result = yield config_service_1.ConfigService.deletePermitedFile(req.params.type);
            return new successResponse_1.OK({
                data: result,
                message: "Delete permited file type successfully!"
            }).send(res);
        });
    }
    static getPageConfig(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield config_service_1.ConfigService.getPageConfig();
            return new successResponse_1.OK({
                data: result,
                message: "Get permited file types successfully!"
            }).send(res);
        });
    }
    static updatePageConfig(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role != "admin")
                throw new errorRespone_1.ForbiddenError("Only admin can update page config.");
            const result = yield config_service_1.ConfigService.updatePageConfig(req.body);
            return new successResponse_1.OK({
                data: result,
                message: "Update page config successfully."
            }).send(res);
        });
    }
}
;
exports.default = ConfigController;
