const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// Create payment intent for coins purchase
exports.createPaymentIntent = async (req, res) => {
    try {
        const { coinAmount } = req.body;

        if (!coinAmount || coinAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Please specify a valid coin amount'
            });
        }

        const amount = coinAmount * process.env.COINS_PRICE; // Price per coin in cents

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata: {
                userId: req.user.id,
                coinAmount
            }
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Confirm coin purchase and add coins to user account
exports.confirmPurchase = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            const { userId, coinAmount } = paymentIntent.metadata;

            // Add coins to user account
            const user = await User.findByIdAndUpdate(
                userId,
                { $inc: { coins: parseInt(coinAmount) } },
                { new: true }
            );

            res.status(200).json({
                success: true,
                data: {
                    coins: user.coins
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not successful'
            });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}; 