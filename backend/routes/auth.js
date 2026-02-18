import express from 'express';

const router = express.Router();

/**
 * POST /api/auth/verify
 * Verify the JARVIS access PIN
 */
router.post('/verify', (req, res) => {

    try {
        const { pin } = req.body;
        // Use configured PIN or fallback to default
        const correctPin = (process.env.JARVIS_PIN || '224232').trim();

        if (!correctPin) {
            // Should not happen now due to default, but safety check
            console.error('❌ JARVIS_PIN error');
            return res.status(500).json({
                success: false,
                error: 'Security configuration error'
            });
        }

        if (!pin || typeof pin !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'PIN is required'
            });
        }

        const userPin = pin.trim();

        // Compare PINs
        if (userPin === correctPin) {
            console.log('✅ JARVIS access granted');
            return res.json({
                success: true,
                message: 'Access granted, Sir.'
            });
        } else {
            console.log(`❌ Invalid PIN attempt. Received length: ${userPin.length}, Expected length: ${correctPin.length}`);
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
