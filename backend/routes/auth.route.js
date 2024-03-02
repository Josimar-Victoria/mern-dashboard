import express from 'express';
import { singupAuthController } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", singupAuthController)

export default router;