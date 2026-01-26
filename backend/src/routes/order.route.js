import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createOrders, getOrders } from "../controllers/order.controller.js";

const router = Router();

router.use(protectRoute);

router.post("/", createOrders);
router.get("/", getOrders);

export default router;