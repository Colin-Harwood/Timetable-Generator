import { Router } from "express"
import { addModule, updateModule, getModule, deleteModule, fetchModuleList, makeTimetable } from "../controller/module.controller.js";

const router = Router();

router.route('/').post(addModule);
router.route('/').put(updateModule);
router.route('/').get(getModule);
router.route('/').delete(deleteModule);
router.route('/list').get(fetchModuleList);
router.route('/create').post(makeTimetable);

export default router;