const dotenv = require('dotenv');
const { v4 } = require('uuid');
const crypto = require('crypto');
const Payment = require('../models/paymentModel');
const User = require('../models/userModel');


dotenv.config();

class PaymentController {
    static createSignature = (message) => {
        const secret = "8gBm/:&EnhH.1/q";
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(message);

        const hashInBase64 = hmac.digest("base64");
        return hashInBase64;
    };

    static checkout = async (req, res) => {
        try {
            const { totalAmount, cartItems } = req.body;

            if (!req.user || !req.user.id) {
                return res.status(400).json({ message: "User ID is missing in the request." });
            }

            const uid = `${req.params.pid}-${v4()}-${req.user.id}`;

            // Store the transaction data in the Payment model
            await Payment.create({
                userId: req.user.id,
                transactionUuid: uid,
                cartItems,
                totalAmount,
                status: 'PENDING'
            });

            const message = `total_amount=${totalAmount},transaction_uuid=${uid},product_code=EPAYTEST`;
            const signature = PaymentController.createSignature(message);

            const formData = {
                amount: totalAmount,
                failure_url: `${process.env.BASE_URL}/api/payment/failed`,
                product_delivery_charge: "0",
                product_service_charge: "0",
                product_code: "EPAYTEST",
                signature: signature,
                signed_field_names: "total_amount,transaction_uuid,product_code",
                success_url: `${process.env.BASE_URL}/api/payment/verify-esewa`,
                tax_amount: "0",
                total_amount: totalAmount,
                transaction_uuid: uid,
            };

            res.json({
                message: "Order Created Successfully",
                formData,
                payment_method: "esewa",
            });
        } catch (error) {
            console.error('Error during checkout:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    static verifyEsewa = async (req, res) => {
        try {
            const { data } = req.query;
            const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

            if (decodedData.status !== "COMPLETE") {
                return res.status(400).json({ message: "Error in transaction status" });
            }

            const message = decodedData.signed_field_names
                .split(",")
                .map(field => `${field}=${decodedData[field] || ""}`)
                .join(",");

            const expectedSignature = PaymentController.createSignature(message);

            if (decodedData.signature !== expectedSignature) {
                return res.status(400).json({ message: "Invalid signature" });
            }

            const userId = decodedData.transaction_uuid.split("-").pop();

            if (!userId || userId === 'undefined') {
                return res.status(400).json({ message: "User ID is missing in transaction UUID." });
            }

            // Retrieve the payment record with cartItems associated with this transaction_uuid
            const payment = await Payment.findOne({ transactionUuid: decodedData.transaction_uuid });

            if (!payment || !payment.cartItems) {
                return res.status(400).json({ message: "No cart items found." });
            }

            // Mark the payment as complete
            payment.status = 'COMPLETE';
            await payment.save();

            res.redirect("http://localhost:3000/dashboard");
        } catch (err) {
            console.log(err.message);
            return res.status(400).json({ error: err.message || "No Orders found" });
        }
    };
}

module.exports = PaymentController;
