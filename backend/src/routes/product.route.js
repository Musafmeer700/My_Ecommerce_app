import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getAllProducts } from "../controllers/admin.controller";
import { getProductsById } from "../controllers/product.controller";

const router = Router();

router.get('/', protectRoute, getAllProducts);
router.get('/:id', protectRoute, getProductsById);

export default router