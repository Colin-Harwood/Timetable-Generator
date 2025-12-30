import { Router } from "express"
import { addModule } from "../controller/module.controller.js";

const router = Router();

router.route('/').post(addModule);

export default router;