"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUUID = exports.asyncHandler = void 0;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const checkUUID = (uuid) => {
    const uuidRegex = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$");
    return uuidRegex.test(uuid);
};
exports.checkUUID = checkUUID;
