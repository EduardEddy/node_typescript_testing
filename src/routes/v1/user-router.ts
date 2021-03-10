import { Router } from 'express'
import {UserCtrl} from '../../controlllers/v1/users-controller';

const router = Router();

router.get('', UserCtrl.getUsers);
router.post('', UserCtrl.createUser);
router.get('/:userId', UserCtrl.getUserById);
router.delete('/:userId', UserCtrl.deleteById);
router.post('/login',UserCtrl.login)
export default router;