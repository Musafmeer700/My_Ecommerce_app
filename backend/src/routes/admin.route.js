import { Router } from "express";
import { createProduct, getAllCustomers, getAllOrders, getAllProducts, getDashboardStats, updateOrderStatus, updateProducts } from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(protectRoute, adminOnly);

router.post("/products", upload.array("images", 3),  createProduct)
router.get("/products", upload.array("images", 3), getAllProducts)
router.put("/products/:id", upload.array("images", 3), updateProducts)

router.get("/order", getAllOrders)
router.patch("/order/:orderId/status", updateOrderStatus)

router.get("/customers", getAllCustomers)
router.get("/stats", getDashboardStats)

export default router;