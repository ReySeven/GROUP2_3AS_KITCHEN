import * as userModel  from '../models/userModel.js';
import bcrypt    from 'bcryptjs';

// get all
export const fetchAllUsers = async () => {
    const users = await userModel.fetch();
    return users;
}

// register
export const createAccount = async (user) => {
    const salt           = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);

    const id = await userModel.insert({
        first_name: user.first_name.trim(),
        last_name:  user.last_name.trim(),
        email:      user.email,
        password:   hashedPassword,
        role:       'c',
    });

    if (!id || id <= 0) {
        throw new Error('Unable to create account. Please try again later.');
    }

    return 'Account created successfully!';
}
