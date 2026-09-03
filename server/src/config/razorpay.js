import Razorpay from 'razorpay';

export function getRazorpayClient() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    const error = new Error('Razorpay credentials are missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env.');
    error.code = 'RAZORPAY_CONFIG_MISSING';
    throw error;
  }

  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
}
