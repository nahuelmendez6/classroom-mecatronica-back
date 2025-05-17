import User from '../models/user.model.js';
import { validationResult } from 'express-validator';

class UserController {
    static async searchUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const { email } = req.body;
        const user = await User.searchUser(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }       

        res.status(200).json({
            success: true,
            message: 'User found',
            data: user
        });
    }
}
export default UserController;