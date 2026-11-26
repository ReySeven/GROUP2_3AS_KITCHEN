import * as otpService from '../services/otpService.js';

export const send = async (req, res) => {
    const { email } = req.body;
    if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email is required.' });
    }
    try {
        const result = await otpService.sendOtp(email.trim().toLowerCase());
        res.status(200).json({ success: true, message: result });
    } catch (e) {
        console.error('[OTP send]', e.message);
        res.status(500).json({ error: e.message || 'Failed to send code.' });
    }
};

export const verify = async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.status(400).json({ error: 'Email and code are required.' });
    }
    try {
        await otpService.verifyOtp(email.trim().toLowerCase(), String(code).trim());
        res.status(200).json({ success: true, message: 'Code verified.' });
    } catch (e) {
        console.error('[OTP verify]', e.message);
        res.status(400).json({ error: e.message });
    }
};
