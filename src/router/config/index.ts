import express from "express";
import { asyncHandler } from "../../utils";
import PrinterController from "../../controllers/printer.controller";
import { authenticateToken } from "../../middlewares/auth.middlewares";
import ConfigController from "../../controllers/config.controller";

const router = express.Router();

// Get config 
router.get("/", asyncHandler(ConfigController.getConfigSettings));
router.get("/filetype", asyncHandler(ConfigController.getPermitedFile));
router.get("/page", asyncHandler(ConfigController.getPageConfig))

// router.use(asyncHandler(authenticateToken));

// Set Filetype config
router.post("/filetype", asyncHandler(ConfigController.addPermitedFile));
router.patch("/filetype/:type", asyncHandler(ConfigController.updatePermitedFile));
router.delete("/filetype/:type", asyncHandler(ConfigController.deletePermitedFile));  
// Update given page settings
router.patch("/page", asyncHandler(ConfigController.updatePageConfig));

export default router;