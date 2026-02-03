import express from 'express';

const router = express.Router();

/**
 * POST /api/auth/verify
 * Verify the JARVIS access PIN
 */
router.post('/verify', (req, res) => {
    try {
        const { pin } = req.body;
        const correctPin = process.env.JARVIS_PIN;

        if (!correctPin) {
            console.error('❌ JARVIS_PIN not configured in .env');
            return res.status(500).json({
                success: false,
                error: 'Security not configured'
            });
        }

        if (!pin || typeof pin !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'PIN is required'
            });
        }

        // Compare PINs (constant-time comparison would be better for production)
        if (pin === correctPin) {
            console.log('✅ JARVIS access granted');
            return res.json({
                success: true,
                message: 'Access granted, Sir.'
            });
        } else {
            console.log('❌ Invalid PIN attempt');
            return res.status(401).json({
                success: false,
                error: 'Invalid PIN'
            });
        }
    } catch (error) {
        console.error('Auth Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Authentication failed'
        });
    }
});

export default router;
