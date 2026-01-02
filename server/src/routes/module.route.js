import { Router } from "express"
import { addModule, updateModule, getModule } from "../controller/module.controller.js";

const router = Router();

router.route('/').post(addModule);
router.route('/').put(updateModule);
router.route('/').get(getModule);

export default router;