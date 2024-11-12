import express from "express"
import { asyncHandler } from "../../utils"
import LocationController from "../../controllers/location.controller"
import { authenticateToken } from "../../middlewares/auth.middlewares";

const router = express.Router()

router.get("/", asyncHandler(LocationController.getLocation));

router.use(asyncHandler(authenticateToken))
router.post("/", asyncHandler(LocationController.insertLocation));
router.patch("/:id", asyncHandler(LocationController.updateLocation));
router.delete("/:id", asyncHandler(LocationController.deleteLocation));

export default router;