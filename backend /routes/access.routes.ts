import { Router } from 'express';
import { checkAccess } from '../controllers/access.controller';

const router = Router();

router.post('/check', checkAccess);

export default router;