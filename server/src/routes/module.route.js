import { Router } from "express"
import { addModule, updateModule, getModule, deleteModule, fetchModuleList } from "../controller/module.controller.js";

const router = Router();

router.route('/').post(addModule);
router.route('/').put(updateModule);
router.route('/').get(getModule);
router.route('/').delete(deleteModule);
router.route('/list').get(fetchModuleList);

export default router;