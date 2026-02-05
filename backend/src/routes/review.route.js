import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createReview } from "../controllers/review.controller.js";

const router = Router();

router.post('/', protectRoute, createReview);
// router.delete('/:reviewId', protectRoute, deleteReview);//this is not implemented

export default router