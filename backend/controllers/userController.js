import * as userService from '../services/userService.js';

export const getAll = async (req, res) => {
    const users = await userService.fetchAllUsers();
    res.status(200).json({ success: true, users });
}

export const createAccount = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const user = { first_name, last_name, email, password };

    try {
        const result = await userService.createAccount(user);
        res.status(200).json({
            success: true,
            message: result
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: `${e.message || "Internal Server Error"}`
        });
    }
}
