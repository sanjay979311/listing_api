


import jwt from 'jsonwebtoken';

export const createToken = (data) => {
    try {
        return jwt.sign(data, process.env.SECRET, { expiresIn: '7d' });
    } catch (error) {
        console.error('Error creating token:', error);
        throw new Error('Token creation failed');
    }
};

