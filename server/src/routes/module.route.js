import { Router } from "express"
import { addModule } from "../controller/module.controller.js";

const router = Router();

router.post('/new', addModule);

export default router;