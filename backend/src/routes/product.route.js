import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllProducts } from "../controllers/admin.controller.js";
import { getProductsById } from "../controllers/product.controller.js";

const router = Router();

router.get('/', protectRoute, getAllProducts);
router.get('/:id', protectRoute, getProductsById);

export default router