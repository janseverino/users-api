import { Request, Response } from 'express';
const logger = require('../utils/logger');
const userService = require('../services/user.service');

const getUsers = (req: Request, res: Response) => {
    try {

        const {
            sort,
            order,
            page = '1',
            size = '10',
        } = req.query || {};

        const pageNumber = parseInt(page as string, 10) || 1;
        const sizeNumber = parseInt(size as string, 10) || 10;

        const users = userService.getUsers({ sort, order, page: pageNumber, size: sizeNumber });
        if (!users) {
            return res.status(404).json({ message: 'Users not found' });
        }

        res.status(200).json(users);
    } catch (error) {
        logger.error('Error in getUsers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getUser = (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const user = userService.getUser(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);

    } catch (error) {
        logger.error('Error in getUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getUsers,
    getUser
}
