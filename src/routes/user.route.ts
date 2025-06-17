import express, { Request, Response } from 'express';
const  userController = require('../controllers/user.controllers');

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);


export default router;