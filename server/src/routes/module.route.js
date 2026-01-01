import { Router } from "express"
import { addModule } from "../controller/module.controller.js";
import { updateModule } from "../controller/module.controller.js";

const router = Router();

router.route('/').post(addModule);
router.route('/').put(updateModule);

export default router;